import HelperMessage from "@/helpers/messages";

const formatBaseUrl = (slug) => {
  return process.env.SSO_API + slug
}

const domainOrigin = process.env.DOMAIN_ORIGIN
const ssoAppClientId = process.env.SSO_APP_CLIENT_ID

export const state = () => ({
})

export const mutations = {
}

export const actions = {
  GetAll: async function ({ commit, rootState }, { url, params }) {
    try{
      var { data } = await this.$axios(formatBaseUrl(url), {
        method: "get",
        params: params,
        headers: {
          'Access-Control-Allow-Origin': domainOrigin,
          'Content-Type': 'application/json',
          'Authorization': rootState.auth.id_token
        },
        crossDomain: true,
        crossorigin: true
      })

      return data
    }catch(ex){
      if(ex.message == "Network Error"){
        throw {
          message: HelperMessage.getMessage("message.modal.error.timeout")
        };
      }
      
      if (ex.response) {
        if(ex.response.status === 401) {
          await this.$axios(formatBaseUrl("/auth/logout"), {
            method: "post",
            headers: {
              'APP-CLIENT-ID': ssoAppClientId,
              'Access-Control-Allow-Origin': domainOrigin,
              Accept: "application/json",
              Content: "application/json",
              Authorization: rootState.auth.access_token
            },
          })
          .then((res) => {
            commit("setAuth", null, {root: true});
            this.$cookies.removeAll()
            this.$router.push({ name: "login" });
          })
          .catch((err) => {
            commit("setAuth", null, {root: true});
            this.$cookies.removeAll()
            this.$router.push({ name: "login" });
          });
        }
        if(ex.response.status === 403) {
          throw {
            message: HelperMessage.getMessage("message.modal.error.forbidden")
          }
        }
      }
      if(ex.response.data){
        throw ex.response.data
      }

      throw {
        message: HelperMessage.getMessage("message.modal.error.timeout")
      };
    }
  },
  GetData: async function ({ commit, rootState }, { url }) {
    try{
      var { data } = await this.$axios(formatBaseUrl(url), {
        method: "get",
        headers: {
          'Access-Control-Allow-Origin': domainOrigin,
          'Content-Type': 'application/json',
          'Authorization': rootState.auth.id_token
        },
        crossDomain: true,
        crossorigin: true
      })

      return data
    }catch(ex){
      if(ex.message == "Network Error"){
        throw {
          message: HelperMessage.getMessage("message.modal.error.timeout")
        };
      }
      
      if (ex.response) {
        if(ex.response.status === 401) {
          await this.$axios(formatBaseUrl("/auth/logout"), {
            method: "post",
            headers: {
              'APP-CLIENT-ID': ssoAppClientId,
              'Access-Control-Allow-Origin': domainOrigin,
              Accept: "application/json",
              Content: "application/json",
              Authorization: rootState.auth.access_token
            },
          })
          .then((res) => {
            commit("setAuth", null, {root: true});
            this.$cookies.removeAll()
            this.$router.push({ name: "login" });
          })
          .catch((err) => {
            commit("setAuth", null, {root: true});
            this.$cookies.removeAll()
            this.$router.push({ name: "login" });
          });
        }
        if(ex.response.status === 403) {
          throw {
            message: HelperMessage.getMessage("message.modal.error.forbidden")
          }
        }
      }
      if(ex.response.data){
        throw ex.response.data
      }

      throw {
        message: HelperMessage.getMessage("message.modal.error.timeout")
      };
    }
  },
  Insert: async function ({ commit, rootState }, { url, request_body }) {
    try{
      var { data } = await this.$axios(formatBaseUrl(url), {
        method: "post",
        data: request_body,
        headers: {
          'Access-Control-Allow-Origin': domainOrigin,
          'Content-Type': 'application/json',
          'Authorization': rootState.auth.id_token
        },
        crossDomain: true,
        crossorigin: true
      })

      return data
    }catch(ex){
      if(ex.message == "Network Error"){
        throw {
          message: HelperMessage.getMessage("message.modal.error.timeout")
        };
      }
      
      if (ex.response) {
        if(ex.response.status === 401) {
          await this.$axios(formatBaseUrl("/auth/logout"), {
            method: "post",
            headers: {
              'APP-CLIENT-ID': ssoAppClientId,
              'Access-Control-Allow-Origin': domainOrigin,
              Accept: "application/json",
              Content: "application/json",
              Authorization: rootState.auth.access_token
            },
          })
          .then((res) => {
            commit("setAuth", null, {root: true});
            this.$cookies.removeAll()
            this.$router.push({ name: "login" });
          })
          .catch((err) => {
            commit("setAuth", null, {root: true});
            this.$cookies.removeAll()
            this.$router.push({ name: "login" });
          });
        }
        if(ex.response.status === 403) {
          throw {
            message: HelperMessage.getMessage("message.modal.error.forbidden")
          }
        }
      }
      if(ex.response.data){
        throw ex.response.data
      }

      throw {
        message: HelperMessage.getMessage("message.modal.error.timeout")
      };
    }
  },
  Update: async function ({ commit, rootState }, { url, request_body }) {
    try{
      var { data } = await this.$axios(formatBaseUrl(url), {
        method: "patch",
        data: request_body,
        headers: {
          'Access-Control-Allow-Origin': domainOrigin,
          'Content-Type': 'application/json',
          'Authorization': rootState.auth.id_token
        },
        crossDomain: true,
        crossorigin: true
      })

      return data
    }catch(ex){
      if(ex.message == "Network Error"){
        throw {
          message: HelperMessage.getMessage("message.modal.error.timeout")
        };
      }
      
      if (ex.response) {
        if(ex.response.status === 401) {
          await this.$axios(formatBaseUrl("/auth/logout"), {
            method: "post",
            headers: {
              'APP-CLIENT-ID': ssoAppClientId,
              'Access-Control-Allow-Origin': domainOrigin,
              Accept: "application/json",
              Content: "application/json",
              Authorization: rootState.auth.access_token
            },
          })
          .then((res) => {
            commit("setAuth", null, {root: true});
            this.$cookies.removeAll()
            this.$router.push({ name: "login" });
          })
          .catch((err) => {
            commit("setAuth", null, {root: true});
            this.$cookies.removeAll()
            this.$router.push({ name: "login" });
          });
        }
        if(ex.response.status === 403) {
          throw {
            message: HelperMessage.getMessage("message.modal.error.forbidden")
          }
        }
      }
      if(ex.response.data){
        throw ex.response.data
      }

      throw {
        message: HelperMessage.getMessage("message.modal.error.timeout")
      };
    }
  },
  UpdateFormData: async function ({ commit, rootState }, { url, request_body }) {
    try{
      var { data } = await this.$axios(formatBaseUrl(url), {
        method: "patch",
        data: request_body,
        headers: {
          'Access-Control-Allow-Origin': domainOrigin,
          'Content-Type': 'multipart/form-data',
          'Authorization': rootState.auth.id_token
        },
        crossDomain: true,
        crossorigin: true
      })

      return data
    }catch(ex){
      if(ex.message == "Network Error"){
        throw {
          message: HelperMessage.getMessage("message.modal.error.timeout")
        };
      }
      
      if (ex.response) {
        if(ex.response.status === 401) {
          await this.$axios(formatBaseUrl("/auth/logout"), {
            method: "post",
            headers: {
              'APP-CLIENT-ID': ssoAppClientId,
              'Access-Control-Allow-Origin': domainOrigin,
              Accept: "application/json",
              Content: "application/json",
              Authorization: rootState.auth.access_token
            },
          })
          .then((res) => {
            commit("setAuth", null, {root: true});
            this.$cookies.removeAll()
            this.$router.push({ name: "login" });
          })
          .catch((err) => {
            commit("setAuth", null, {root: true});
            this.$cookies.removeAll()
            this.$router.push({ name: "login" });
          });
        }
        if(ex.response.status === 403) {
          throw {
            message: HelperMessage.getMessage("message.modal.error.forbidden")
          }
        }
      }
      if(ex.response.data){
        throw ex.response.data
      }

      throw {
        message: HelperMessage.getMessage("message.modal.error.timeout")
      };
    }
  },
  Delete: async function ({ commit, rootState }, { url }) {
    try{
      var { data } = await this.$axios(formatBaseUrl(url), {
        method: "delete",
        headers: {
          'Access-Control-Allow-Origin': domainOrigin,
          'Content-Type': 'application/json',
          'Authorization': rootState.auth.id_token
        },
        crossDomain: true,
        crossorigin: true
      })

      return data
    }catch(ex){
      if(ex.message == "Network Error"){
        throw {
          message: HelperMessage.getMessage("message.modal.error.timeout")
        };
      }
      
      if (ex.response) {
        if(ex.response.status === 401) {
          await this.$axios(formatBaseUrl("/auth/logout"), {
            method: "post",
            headers: {
              'APP-CLIENT-ID': ssoAppClientId,
              'Access-Control-Allow-Origin': domainOrigin,
              Accept: "application/json",
              Content: "application/json",
              Authorization: rootState.auth.access_token
            },
          })
          .then((res) => {
            commit("setAuth", null, {root: true});
            this.$cookies.removeAll()
            this.$router.push({ name: "login" });
          })
          .catch((err) => {
            commit("setAuth", null, {root: true});
            this.$cookies.removeAll()
            this.$router.push({ name: "login" });
          });
        }
        if(ex.response.status === 403) {
          throw {
            message: HelperMessage.getMessage("message.modal.error.forbidden")
          }
        }
      }
      if(ex.response.data){
        throw ex.response.data
      }

      throw {
        message: HelperMessage.getMessage("message.modal.error.timeout")
      };
    }
  },
  InsertIgnoreError: async function ({ commit, rootState }, { url, request_body }) {
    try{
      var { data } = await this.$axios(formatBaseUrl(url), {
        method: "post",
        data: request_body,
        headers: {
          'Access-Control-Allow-Origin': domainOrigin,
          'Content-Type': 'application/json',
          'Authorization': rootState.auth.id_token
        },
        crossDomain: true,
        crossorigin: true
      })

      return data
    }catch(ex){
      console.error(ex);
    }
  },
}