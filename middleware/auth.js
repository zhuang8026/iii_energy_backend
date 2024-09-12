export default function ({
  store, redirect, route,
}) {
  const { token } = store.state.user;
  const { ntpcMode } = route.meta[0];
  const toPath = route.path;

  if (toPath === '/version') {
    return true;
  }


  if (toPath === '/login' || toPath === '/ntpc3/login') {
    if (!token) {
      return false;
    }
    if (ntpcMode) {
      return redirect('/ntpc3');
    }
    return redirect('/');
  }

  if (!token && ntpcMode) {
    return redirect('/ntpc3/login');
  }

  if (!token && !ntpcMode) {
    return redirect('/login');
  }

  return false;
}
