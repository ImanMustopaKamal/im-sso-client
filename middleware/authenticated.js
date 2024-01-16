export default function ({ store, redirect }) {
  if(store.state.auth) { 
    if(new Date(store.state.auth.expiration_date) < new Date(Date.now())){
      store.dispatch("clearAuth", redirect);
    }
  } else { 
    return redirect('/login')
  }
}
