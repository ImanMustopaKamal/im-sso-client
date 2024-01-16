const formatBaseSSO = (slug) => {
  return process.env.SSO_API + slug
}
const domainOrigin = process.env.DOMAIN_ORIGIN
const domainSSO = process.env.SSO_DOMAIN
const ssoAppClientId = process.env.SSO_APP_CLIENT_ID

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export const state = () => {
  return {
    auth: null,
    tenant: null
  };
};
export const mutations = {
  setAuth(state, auth, error) {
    state.auth = auth;
    if (auth) {
      let group_access_store = [
        {
          group: "AccountOwner",
          access: ["dashboard", "organization", "members", "subscription"],
        },
        {
          group: "AccountMember",
          access: ["dashboard"],
        },
      ];
      if (auth.groups) {
        let group_access = []
        for (let i = 0; i < auth.groups.length; i++) {
          const accessObj = group_access_store.find(
            (ga) => ga.group === auth.groups[i]
          )
          if (accessObj) {
            group_access = accessObj.access
          }
        }
        state.auth.access = group_access;
      }
      else {
        state.auth.access = []
      }
    }

    if (error) console.log("[MUTATION] setAuth", error);
  },
  clearAuth(state, redirect) {
    state.auth = null;
    redirect("/login");
  },
  setAuthUserDetail(state, userDetail, error) {
    state.auth.user_detail = userDetail;
  },
  setTenant(state, tenant, error) {
    state.tenant = tenant;

    if (error) console.log("[MUTATION] setTenant", error);
  },
};
export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req, redirect }) {
    if (req.headers.cookie) {
      const idToken = getCookie(req.headers.cookie, "IdToken");
      const accessToken = getCookie(req.headers.cookie, "AccessToken");
      const refreshToken = getCookie(req.headers.cookie, "RefreshToken");
      try {
        if (refreshToken) {
          try {
            let auth = {}
            let idTokenParse = parseJwt(idToken)
            auth.expiration_date = new Date(idTokenParse.exp * 1000)
            auth.user_id = idTokenParse["custom:user_id"]
            auth.tenant_id = idTokenParse["custom:tenant_id"]
            auth.username = idTokenParse["cognito:username"]
            auth.name = idTokenParse.name
            auth.auth_time = idTokenParse.auth_time
            auth.id_token = idToken
            auth.access_token = accessToken
            auth.refresh_token = refreshToken
            if (idTokenParse["cognito:groups"]) {
              auth.groups = idTokenParse["cognito:groups"]
            }
            commit("setAuth", auth);
          } catch (err) {
            console.log(err);
            commit("setAuth", null, err);
          }
        } else {
          commit("setAuth", null, err);
        }
      } catch (err) {
        commit("setAuth", null, err);
      }
    }
  },
  clearAuth({ commit }, redirect) {
    commit("clearAuth", redirect);
  },
  refreshToken({ commit, state }) {
    if (state.auth) {
      if (new Date() < new Date(state.auth.expiration_date)) {
        return this.$cognito.RefreshToken(state.auth.refresh_token)
          .then((result) => {
            try {
              const idToken = result.IdToken
              const accessToken = result.AccessToken
              const refreshToken = state.auth.refresh_token
              const expiration_date = new Date().getTime() + result.ExpiresIn * 1000;
              this.$cookies.set('IdToken', idToken, {
                expires: new Date(expiration_date),
                path: "/",
                domain: domainSSO,
                // httpOnly: true,
                // secure: true,
              })
              this.$cookies.set('AccessToken', accessToken, {
                expires: new Date(expiration_date),
                path: "/",
                domain: domainSSO,
                // httpOnly: true,
                // secure: true,
              })
              this.$cookies.set('RefreshToken', refreshToken, {
                expires: new Date(expiration_date),
                path: "/",
                domain: domainSSO,
                // httpOnly: true,
                // secure: true,
              })
              let auth = {}
              let idTokenParse = parseJwt(idToken)
              auth.expiration_date = new Date(idTokenParse.exp * 1000)
              auth.user_id = idTokenParse["custom:user_id"]
              auth.tenant_id = idTokenParse["custom:tenant_id"]
              auth.username = idTokenParse["cognito:username"]
              auth.name = idTokenParse.name
              auth.auth_time = idTokenParse.auth_time
              auth.id_token = idToken
              auth.access_token = accessToken
              auth.refresh_token = refreshToken
              if (idTokenParse["cognito:groups"]) {
                auth.groups = idTokenParse["cognito:groups"]
              }
              commit("setAuth", auth);
            } catch (err) {
              commit("setAuth", null, err);
            }
          })
          .catch((err) => {
            commit("setAuth", null, err);
          });
      }
    } else {
      commit("setAuth", null);
    }
  },
  async accessPage({ state }, { page }) {
    if(!state.auth.access.includes(page)){
      this.$router.push({ name: '404' });
    }
  }
};

function getCookie(headersCookie, name) {
  const value = `; ${headersCookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
}
