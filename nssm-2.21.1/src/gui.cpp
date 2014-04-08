#include "nssm.h"

static enum { NSSM_TAB_APPLICATION, NSSM_TAB_SHUTDOWN, NSSM_TAB_EXIT, NSSM_TAB_IO, NSSM_TAB_ENVIRONMENT, NSSM_NUM_TABS };
static HWND tablist[NSSM_NUM_TABS];
static int selected_tab;

int nssm_gui(int resource, char *name) {
  /* Create window */
  HWND dlg = CreateDialog(0, MAKEINTRESOURCE(resource), 0, install_dlg);
  if (! dlg) {
    popup_message(MB_OK, NSSM_GUI_CREATEDIALOG_FAILED, error_string(GetLastError()));
    return 1;
  }

  /* Display the window */
  centre_window(dlg);
  ShowWindow(dlg, SW_SHOW);

  /* Set service name if given */
  if (name) {
    SetDlgItemText(dlg, IDC_NAME, name);
    /* No point making user click remove if the name is already entered */
    if (resource == IDD_REMOVE) {
      HWND button = GetDlgItem(dlg, IDC_REMOVE);
      if (button) {
        SendMessage(button, WM_LBUTTONDOWN, 0, 0);
        SendMessage(button, WM_LBUTTONUP, 0, 0);
      }
    }
  }

  /* Go! */
  MSG message;
  while (GetMessage(&message, 0, 0, 0)) {
    if (IsDialogMessage(dlg, &message)) continue;
    TranslateMessage(&message);
    DispatchMessage(&message);
  }

  return (int) message.wParam;
}

void centre_window(HWND window) {
  HWND desktop;
  RECT size, desktop_size;
  unsigned long x, y;

  if (! window) return;

  /* Find window size */
  if (! GetWindowRect(window, &size)) return;
  
  /* Find desktop window */
  desktop = GetDesktopWindow();
  if (! desktop) return;

  /* Find desktop window size */
  if (! GetWindowRect(desktop, &desktop_size)) return;

  /* Centre window */
  x = (desktop_size.right - size.right) / 2;
  y = (desktop_size.bottom - size.bottom) / 2;
  MoveWindow(window, x, y, size.right - size.left, size.bottom - size.top, 0);
}

static inline void check_stop_method(nssm_service_t *service, unsigned long method, unsigned long control) {
  if (SendDlgItemMessage(tablist[NSSM_TAB_SHUTDOWN], control, BM_GETCHECK, 0, 0) & BST_CHECKED) return;
  service->stop_method &= ~method;
}

static inline void check_method_timeout(HWND tab, unsigned long control, unsigned long *timeout) {
  BOOL translated;
  unsigned long configured = GetDlgItemInt(tab, control, &translated, 0);
  if (translated) *timeout = configured;
}

static inline void check_io(char *name, char *buffer, size_t bufsize, unsigned long control) {
  if (! SendMessage(GetDlgItem(tablist[NSSM_TAB_IO], control), WM_GETTEXTLENGTH, 0, 0)) return;
  if (GetDlgItemText(tablist[NSSM_TAB_IO], control, buffer, (int) bufsize)) return;
  popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_MESSAGE_PATH_TOO_LONG, name);
  ZeroMemory(buffer, bufsize);
}

/* Install the service. */
int install(HWND window) {
  if (! window) return 1;

  nssm_service_t *service = alloc_nssm_service();
  if (service) {
    set_nssm_service_defaults(service);

    /* Get service name. */
    if (! GetDlgItemText(window, IDC_NAME, service->name, sizeof(service->name))) {
      popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_GUI_MISSING_SERVICE_NAME);
      cleanup_nssm_service(service);
      return 2;
    }

    /* Get executable name */
    if (! GetDlgItemText(tablist[NSSM_TAB_APPLICATION], IDC_PATH, service->exe, sizeof(service->exe))) {
      popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_GUI_MISSING_PATH);
      return 3;
    }

    /* Get startup directory. */
    if (! GetDlgItemText(tablist[NSSM_TAB_APPLICATION], IDC_DIR, service->dir, sizeof(service->dir))) {
      memmove(service->dir, service->exe, sizeof(service->dir));
      strip_basename(service->dir);
    }

    /* Get flags. */
    if (SendMessage(GetDlgItem(tablist[NSSM_TAB_APPLICATION], IDC_FLAGS), WM_GETTEXTLENGTH, 0, 0)) {
      if (! GetDlgItemText(tablist[NSSM_TAB_APPLICATION], IDC_FLAGS, service->flags, sizeof(service->flags))) {
        popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_GUI_INVALID_OPTIONS);
        return 4;
      }
    }

    /* Get stop method stuff. */
    check_stop_method(service, NSSM_STOP_METHOD_CONSOLE, IDC_METHOD_CONSOLE);
    check_stop_method(service, NSSM_STOP_METHOD_WINDOW, IDC_METHOD_WINDOW);
    check_stop_method(service, NSSM_STOP_METHOD_THREADS, IDC_METHOD_THREADS);
    check_stop_method(service, NSSM_STOP_METHOD_TERMINATE, IDC_METHOD_TERMINATE);
    check_method_timeout(tablist[NSSM_TAB_SHUTDOWN], IDC_KILL_CONSOLE, &service->kill_console_delay);
    check_method_timeout(tablist[NSSM_TAB_SHUTDOWN], IDC_KILL_WINDOW, &service->kill_window_delay);
    check_method_timeout(tablist[NSSM_TAB_SHUTDOWN], IDC_KILL_THREADS, &service->kill_threads_delay);

    /* Get exit action stuff. */
    check_method_timeout(tablist[NSSM_TAB_EXIT], IDC_THROTTLE, &service->throttle_delay);
    HWND combo = GetDlgItem(tablist[NSSM_TAB_EXIT], IDC_APPEXIT);
    service->default_exit_action = (unsigned long) SendMessage(combo, CB_GETCURSEL, 0, 0);
    if (service->default_exit_action == CB_ERR) service->default_exit_action = 0;

    /* Get I/O stuff. */
    check_io("stdin", service->stdin_path, sizeof(service->stdin_path), IDC_STDIN);
    check_io("stdout", service->stdout_path, sizeof(service->stdout_path), IDC_STDOUT);
    check_io("stderr", service->stderr_path, sizeof(service->stderr_path), IDC_STDERR);
    /* Override stdout and/or stderr. */
    if (SendDlgItemMessage(tablist[NSSM_TAB_IO], IDC_TRUNCATE, BM_GETCHECK, 0, 0) & BST_CHECKED) {
      if (service->stdout_path[0]) service->stdout_disposition = CREATE_ALWAYS;
      if (service->stderr_path[0]) service->stderr_disposition = CREATE_ALWAYS;
    }

    /* Get environment. */
    unsigned long envlen = (unsigned long) SendMessage(GetDlgItem(tablist[NSSM_TAB_ENVIRONMENT], IDC_ENVIRONMENT), WM_GETTEXTLENGTH, 0, 0);
    if (envlen) {
      char *env = (char *) HeapAlloc(GetProcessHeap(), HEAP_ZERO_MEMORY, envlen + 2);
      if (! env) {
        popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_EVENT_OUT_OF_MEMORY, "environment", "install()");
        cleanup_nssm_service(service);
        return 5;
      }

      if (! GetDlgItemText(tablist[NSSM_TAB_ENVIRONMENT], IDC_ENVIRONMENT, env, envlen + 1)) {
        popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_GUI_INVALID_ENVIRONMENT);
        HeapFree(GetProcessHeap(), 0, env);
        cleanup_nssm_service(service);
        return 5;
      }

      /* Strip CR and replace LF with NULL. */
      unsigned long newlen = 0;
      unsigned long i, j;
      for (i = 0; i < envlen; i++) if (env[i] != '\r') newlen++;
      /* Must end with two NULLs. */
      newlen += 2;

      char *newenv = (char *) HeapAlloc(GetProcessHeap(), HEAP_ZERO_MEMORY, newlen);
      if (! newenv) {
        HeapFree(GetProcessHeap(), 0, env);
        popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_EVENT_OUT_OF_MEMORY, "environment", "install()");
        cleanup_nssm_service(service);
        return 5;
      }

      for (i = 0, j = 0; i < envlen; i++) {
        if (env[i] == '\r') continue;
        if (env[i] == '\n') newenv[j] = '\0';
        else newenv[j] = env[i];
        j++;
      }

      HeapFree(GetProcessHeap(), 0, env);
      env = newenv;
      envlen = newlen;

      /* Test the environment is valid. */
      char path[MAX_PATH];
      GetModuleFileName(0, path, sizeof(path));
      STARTUPINFO si;
      ZeroMemory(&si, sizeof(si));
      si.cb = sizeof(si);
      PROCESS_INFORMATION pi;
      ZeroMemory(&pi, sizeof(pi));

      if (! CreateProcess(0, path, 0, 0, 0, CREATE_SUSPENDED, env, 0, &si, &pi)) {
        unsigned long error = GetLastError();
        if (error == ERROR_INVALID_PARAMETER) {
          popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_GUI_INVALID_ENVIRONMENT);
          HeapFree(GetProcessHeap(), 0, env);
          envlen = 0;
        }
        cleanup_nssm_service(service);
        return 5;
      }
      TerminateProcess(pi.hProcess, 0);

      if (SendDlgItemMessage(tablist[NSSM_TAB_ENVIRONMENT], IDC_ENVIRONMENT_REPLACE, BM_GETCHECK, 0, 0) & BST_CHECKED) {
        service->env = env;
        service->envlen = envlen;
      }
      else {
        service->env_extra = env;
        service->env_extralen = envlen;
      }
    }
  }

  /* See if it works. */
  switch (install_service(service)) {
    case 1:
      popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_EVENT_OUT_OF_MEMORY, "service", "install()");
      cleanup_nssm_service(service);
      return 1;

    case 2:
      popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_MESSAGE_OPEN_SERVICE_MANAGER_FAILED);
      cleanup_nssm_service(service);
      return 2;

    case 3:
      popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_MESSAGE_PATH_TOO_LONG, NSSM);
      cleanup_nssm_service(service);
      return 3;

    case 4:
      popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_GUI_OUT_OF_MEMORY_FOR_IMAGEPATH);
      cleanup_nssm_service(service);
      return 4;

    case 5:
      popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_GUI_INSTALL_SERVICE_FAILED);
      cleanup_nssm_service(service);
      return 5;

    case 6:
      popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_GUI_CREATE_PARAMETERS_FAILED);
      cleanup_nssm_service(service);
      return 6;
  }

  popup_message(MB_OK, NSSM_MESSAGE_SERVICE_INSTALLED, service->name);
  cleanup_nssm_service(service);
  return 0;
}

/* Remove the service */
int remove(HWND window) {
  if (! window) return 1;

  /* See if it works */
  nssm_service_t *service = alloc_nssm_service();
  if (service) {
    /* Get service name */
    if (! GetDlgItemText(window, IDC_NAME, service->name, sizeof(service->name))) {
      popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_GUI_MISSING_SERVICE_NAME);
      cleanup_nssm_service(service);
      return 2;
    }

    /* Confirm */
    if (popup_message(MB_YESNO, NSSM_GUI_ASK_REMOVE_SERVICE, service->name) != IDYES) {
      cleanup_nssm_service(service);
      return 0;
    }
  }

  switch (remove_service(service)) {
    case 1:
      popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_EVENT_OUT_OF_MEMORY, "service", "remove()");
      cleanup_nssm_service(service);
      return 1;

    case 2:
      popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_MESSAGE_OPEN_SERVICE_MANAGER_FAILED);
      cleanup_nssm_service(service);
      return 2;

    case 3:
      popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_GUI_SERVICE_NOT_INSTALLED);
      return 3;
      cleanup_nssm_service(service);

    case 4:
      popup_message(MB_OK | MB_ICONEXCLAMATION, NSSM_GUI_REMOVE_SERVICE_FAILED);
      cleanup_nssm_service(service);
      return 4;
  }

  popup_message(MB_OK, NSSM_MESSAGE_SERVICE_REMOVED, service->name);
  cleanup_nssm_service(service);
  return 0;
}

static char *browse_filter(int message) {
  switch (message) {
    case NSSM_GUI_BROWSE_FILTER_APPLICATIONS: return "*.exe;*.bat;*.cmd";
    case NSSM_GUI_BROWSE_FILTER_DIRECTORIES: return ".";
    case NSSM_GUI_BROWSE_FILTER_ALL_FILES: /* Fall through. */
    default: return "*.*";
  }
}

UINT_PTR CALLBACK browse_hook(HWND dlg, UINT message, WPARAM w, LPARAM l) {
  switch (message) {
    case WM_INITDIALOG:
      return 1;
  }

  return 0;
}

/* Browse for application */
void browse(HWND window, char *current, unsigned long flags, ...) {
  if (! window) return;

  va_list arg;
  size_t bufsize = 256;
  size_t len = bufsize;
  int i;

  OPENFILENAME ofn;
  ZeroMemory(&ofn, sizeof(ofn));
  ofn.lStructSize = sizeof(ofn);
  ofn.lpstrFilter = (char *) HeapAlloc(GetProcessHeap(), 0, bufsize);
  /* XXX: Escaping nulls with FormatMessage is tricky */
  if (ofn.lpstrFilter) {
    ZeroMemory((void *) ofn.lpstrFilter, bufsize);
    len = 0;
    /* "Applications" + NULL + "*.exe" + NULL */
    va_start(arg, flags);
    while (i = va_arg(arg, int)) {
      char *localised = message_string(i);
      _snprintf_s((char *) ofn.lpstrFilter + len, bufsize, _TRUNCATE, localised);
      len += strlen(localised) + 1;
      LocalFree(localised);
      char *filter = browse_filter(i);
      _snprintf_s((char *) ofn.lpstrFilter + len, bufsize - len, _TRUNCATE, "%s", filter);
      len += strlen(filter) + 1;
    }
    va_end(arg);
    /* Remainder of the buffer is already zeroed */
  }
  ofn.lpstrFile = new char[MAX_PATH];
  if (flags & OFN_NOVALIDATE) {
    /* Directory hack. */
    _snprintf_s(ofn.lpstrFile, MAX_PATH, _TRUNCATE, ":%s:", message_string(NSSM_GUI_BROWSE_FILTER_DIRECTORIES));
  }
  else _snprintf_s(ofn.lpstrFile, MAX_PATH, _TRUNCATE, "%s", current);
  ofn.lpstrTitle = message_string(NSSM_GUI_BROWSE_TITLE);
  ofn.nMaxFile = MAX_PATH;
  ofn.Flags = OFN_EXPLORER | OFN_HIDEREADONLY | OFN_PATHMUSTEXIST | flags;

  if (GetOpenFileName(&ofn)) {
    /* Directory hack. */
    if (flags & OFN_NOVALIDATE) strip_basename(ofn.lpstrFile);
    SendMessage(window, WM_SETTEXT, 0, (LPARAM) ofn.lpstrFile);
  }
  if (ofn.lpstrFilter) HeapFree(GetProcessHeap(), 0, (void *) ofn.lpstrFilter);

  delete[] ofn.lpstrFile;
}

INT_PTR CALLBACK tab_dlg(HWND tab, UINT message, WPARAM w, LPARAM l) {
  switch (message) {
    case WM_INITDIALOG:
      return 1;

    /* Button was pressed or control was controlled. */
    case WM_COMMAND:
      HWND dlg;
      char buffer[MAX_PATH];

      switch (LOWORD(w)) {
        /* Browse for application. */
        case IDC_BROWSE:
          dlg = GetDlgItem(tab, IDC_PATH);
          GetDlgItemText(tab, IDC_PATH, buffer, sizeof(buffer));
          browse(dlg, buffer, OFN_FILEMUSTEXIST, NSSM_GUI_BROWSE_FILTER_APPLICATIONS, NSSM_GUI_BROWSE_FILTER_ALL_FILES, 0);
          /* Fill in startup directory if it wasn't already specified. */
          GetDlgItemText(tab, IDC_DIR, buffer, sizeof(buffer));
          if (! buffer[0]) {
            GetDlgItemText(tab, IDC_PATH, buffer, sizeof(buffer));
            strip_basename(buffer);
            SetDlgItemText(tab, IDC_DIR, buffer);
          }
          break;

          /* Browse for startup directory. */
        case IDC_BROWSE_DIR:
          dlg = GetDlgItem(tab, IDC_DIR);
          GetDlgItemText(tab, IDC_DIR, buffer, sizeof(buffer));
          browse(dlg, buffer, OFN_NOVALIDATE, NSSM_GUI_BROWSE_FILTER_DIRECTORIES, 0);
          break;

        /* Browse for stdin. */
        case IDC_BROWSE_STDIN:
          dlg = GetDlgItem(tab, IDC_STDIN);
          GetDlgItemText(tab, IDC_STDIN, buffer, sizeof(buffer));
          browse(dlg, buffer, 0, NSSM_GUI_BROWSE_FILTER_ALL_FILES, 0);
          break;

        /* Browse for stdout. */
        case IDC_BROWSE_STDOUT:
          dlg = GetDlgItem(tab, IDC_STDOUT);
          GetDlgItemText(tab, IDC_STDOUT, buffer, sizeof(buffer));
          browse(dlg, buffer, 0, NSSM_GUI_BROWSE_FILTER_ALL_FILES, 0);
          /* Fill in stderr if it wasn't already specified. */
          GetDlgItemText(tab, IDC_STDERR, buffer, sizeof(buffer));
          if (! buffer[0]) {
            GetDlgItemText(tab, IDC_STDOUT, buffer, sizeof(buffer));
            SetDlgItemText(tab, IDC_STDERR, buffer);
          }
          break;

        /* Browse for stderr. */
        case IDC_BROWSE_STDERR:
          dlg = GetDlgItem(tab, IDC_STDERR);
          GetDlgItemText(tab, IDC_STDERR, buffer, sizeof(buffer));
          browse(dlg, buffer, 0, NSSM_GUI_BROWSE_FILTER_ALL_FILES, 0);
          break;
      }
      return 1;
  }

  return 0;
}

/* Install/remove dialogue callback */
INT_PTR CALLBACK install_dlg(HWND window, UINT message, WPARAM w, LPARAM l) {
  switch (message) {
    /* Creating the dialogue */
    case WM_INITDIALOG:
      SetFocus(GetDlgItem(window, IDC_NAME));

      HWND tabs;
      HWND combo;
      tabs = GetDlgItem(window, IDC_TAB1);
      if (! tabs) return 0;

      /* Set up tabs. */
      TCITEM tab;
      ZeroMemory(&tab, sizeof(tab));
      tab.mask = TCIF_TEXT;

      /* Application tab. */
      tab.pszText = message_string(NSSM_GUI_TAB_APPLICATION);
      tab.cchTextMax = (int) strlen(tab.pszText);
      SendMessage(tabs, TCM_INSERTITEM, NSSM_TAB_APPLICATION, (LPARAM) &tab);
      tablist[NSSM_TAB_APPLICATION] = CreateDialog(0, MAKEINTRESOURCE(IDD_APPLICATION), window, tab_dlg);
      ShowWindow(tablist[NSSM_TAB_APPLICATION], SW_SHOW);

      /* Shutdown tab. */
      tab.pszText = message_string(NSSM_GUI_TAB_SHUTDOWN);
      tab.cchTextMax = (int) strlen(tab.pszText);
      SendMessage(tabs, TCM_INSERTITEM, NSSM_TAB_SHUTDOWN, (LPARAM) &tab);
      tablist[NSSM_TAB_SHUTDOWN] = CreateDialog(0, MAKEINTRESOURCE(IDD_SHUTDOWN), window, tab_dlg);
      ShowWindow(tablist[NSSM_TAB_SHUTDOWN], SW_HIDE);

      /* Set defaults. */
      SendDlgItemMessage(tablist[NSSM_TAB_SHUTDOWN], IDC_METHOD_CONSOLE, BM_SETCHECK, BST_CHECKED, 0);
      SetDlgItemInt(tablist[NSSM_TAB_SHUTDOWN], IDC_KILL_CONSOLE, NSSM_KILL_CONSOLE_GRACE_PERIOD, 0);
      SendDlgItemMessage(tablist[NSSM_TAB_SHUTDOWN], IDC_METHOD_WINDOW, BM_SETCHECK, BST_CHECKED, 0);
      SetDlgItemInt(tablist[NSSM_TAB_SHUTDOWN], IDC_KILL_WINDOW, NSSM_KILL_WINDOW_GRACE_PERIOD, 0);
      SendDlgItemMessage(tablist[NSSM_TAB_SHUTDOWN], IDC_METHOD_THREADS, BM_SETCHECK, BST_CHECKED, 0);
      SetDlgItemInt(tablist[NSSM_TAB_SHUTDOWN], IDC_KILL_THREADS, NSSM_KILL_THREADS_GRACE_PERIOD, 0);
      SendDlgItemMessage(tablist[NSSM_TAB_SHUTDOWN], IDC_METHOD_TERMINATE, BM_SETCHECK, BST_CHECKED, 0);

      /* Restart tab. */
      tab.pszText = message_string(NSSM_GUI_TAB_EXIT);
      tab.cchTextMax = (int) strlen(tab.pszText);
      SendMessage(tabs, TCM_INSERTITEM, NSSM_TAB_EXIT, (LPARAM) &tab);
      tablist[NSSM_TAB_EXIT] = CreateDialog(0, MAKEINTRESOURCE(IDD_APPEXIT), window, tab_dlg);
      ShowWindow(tablist[NSSM_TAB_EXIT], SW_HIDE);

      /* Set defaults. */
      SetDlgItemInt(tablist[NSSM_TAB_EXIT], IDC_THROTTLE, NSSM_RESET_THROTTLE_RESTART, 0);
      combo = GetDlgItem(tablist[NSSM_TAB_EXIT], IDC_APPEXIT);
      SendMessage(combo, CB_INSERTSTRING, NSSM_EXIT_RESTART, (LPARAM) message_string(NSSM_GUI_EXIT_RESTART));
      SendMessage(combo, CB_INSERTSTRING, NSSM_EXIT_IGNORE, (LPARAM) message_string(NSSM_GUI_EXIT_IGNORE));
      SendMessage(combo, CB_INSERTSTRING, NSSM_EXIT_REALLY, (LPARAM) message_string(NSSM_GUI_EXIT_REALLY));
      SendMessage(combo, CB_INSERTSTRING, NSSM_EXIT_UNCLEAN, (LPARAM) message_string(NSSM_GUI_EXIT_UNCLEAN));
      SendMessage(combo, CB_SETCURSEL, NSSM_EXIT_RESTART, 0);

      /* I/O tab. */
      tab.pszText = message_string(NSSM_GUI_TAB_IO);
      tab.cchTextMax = (int) strlen(tab.pszText) + 1;
      SendMessage(tabs, TCM_INSERTITEM, NSSM_TAB_IO, (LPARAM) &tab);
      tablist[NSSM_TAB_IO] = CreateDialog(0, MAKEINTRESOURCE(IDD_IO), window, tab_dlg);
      ShowWindow(tablist[NSSM_TAB_IO], SW_HIDE);

      /* Environment tab. */
      tab.pszText = message_string(NSSM_GUI_TAB_ENVIRONMENT);
      tab.cchTextMax = (int) strlen(tab.pszText) + 1;
      SendMessage(tabs, TCM_INSERTITEM, NSSM_TAB_ENVIRONMENT, (LPARAM) &tab);
      tablist[NSSM_TAB_ENVIRONMENT] = CreateDialog(0, MAKEINTRESOURCE(IDD_ENVIRONMENT), window, tab_dlg);
      ShowWindow(tablist[NSSM_TAB_ENVIRONMENT], SW_HIDE);

      selected_tab = 0;

      return 1;

    /* Tab change. */
    case WM_NOTIFY:
      NMHDR *notification;

      notification = (NMHDR *) l;
      switch (notification->code) {
        case TCN_SELCHANGE:
          HWND tabs;
          int selection;

          tabs = GetDlgItem(window, IDC_TAB1);
          if (! tabs) return 0;

          selection = (int) SendMessage(tabs, TCM_GETCURSEL, 0, 0);
          if (selection != selected_tab) {
            ShowWindow(tablist[selected_tab], SW_HIDE);
            /*
              XXX: Sets focus to the service name which isn't ideal but is
                   better than leaving it in another tab.
            */
            ShowWindow(tablist[selection], SW_SHOWDEFAULT);
            SetFocus(tablist[selection]);
            selected_tab = selection;
          }
          return 1;
      }

      return 0;

    /* Button was pressed or control was controlled */
    case WM_COMMAND:
      switch (LOWORD(w)) {
        /* OK button */
        case IDOK:
          if (! install(window)) PostQuitMessage(0);
          break;

        /* Cancel button */
        case IDCANCEL:
          DestroyWindow(window);
          break;

        /* Remove button */
        case IDC_REMOVE:
          if (! remove(window)) PostQuitMessage(0);
          break;
      }
      return 1;

    /* Window closing */
    case WM_CLOSE:
      DestroyWindow(window);
      return 0;
    case WM_DESTROY:
      PostQuitMessage(0);
  }
  return 0;
}
