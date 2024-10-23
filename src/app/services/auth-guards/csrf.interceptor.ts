import { HttpInterceptorFn } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const csrftoken = getCookie('csrftoken');

  if (csrftoken) {
    const cloned = req.clone({
      setHeaders: {
        'X-CSRFToken': csrftoken
      }
    });

    return next(cloned);
  } else {
    return next(req);
  }
};

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}
