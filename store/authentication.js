import HelperMessage from "@/helpers/messages";
import HelperText from "@/helpers/texts";

const formatBaseSSO = (slug) => {
  return process.env.SSO_API + slug;
};
const domainOrigin = process.env.DOMAIN_ORIGIN;
const ssoAppClientId = process.env.SSO_APP_CLIENT_ID;
const domainSSO = process.env.SSO_DOMAIN;

export const state = () => ({
  referrer_url: null
});

export const mutations = {
  SET_REFERRER_URL: (state, url ) => {
    state.referrer_url = url
  }
};

export const actions = {
  Register: async function ({ commit, state }, payload) {
    try {
      const generateTenantId = HelperText.GenerateId(8);
      const generateUserId = HelperText.GenerateId(8);
      const signUpParams = {
        tenant_id: generateTenantId,
        tenant_name: payload.company_name,
        user_id: generateUserId,
        name: payload.name,
        email: payload.email,
        phone_number: payload.phone,
        password: payload.password
      }

      await this.$cognito.SignUp(signUpParams)
      return true
    } catch (err) {
      throw err.message;
    }
  },
  Verify: async function ({ commit, state }, payload) {
    try {
      const confirmSignUpParams = {
        username: payload.username,
        confirmation_code: payload.confirmation_code
      }
      return await this.$cognito.ConfirmSignUp(confirmSignUpParams)
    } catch (err) {
      throw err.message;
    }
  },
  VerifyRequest: async function ({ commit, state }, payload) {
    try {
      const resendConfirmationCodeParams = payload.username
      return await this.$cognito.ResendConfirmationCode(resendConfirmationCodeParams)
    } catch (err) {
      throw err.message;
    }
  },
  Login: async function ({ commit, dispatch, state }, { username, password }) {
    console.log("domainSSO: ", domainSSO)
    try {
      let result = await this.$cognito.Login(username, password)

      if (result) {
        const idTokenParse = HelperText.ParseJwt(result.IdToken)
        
        let data = {
          id_token: result.IdToken,
          access_token: result.AccessToken,
          refresh_token: result.RefreshToken,
          expires_in: result.ExpiresIn,
          user_id: idTokenParse["custom:user_id"],
          tenant_id: idTokenParse["custom:tenant_id"],
          username: idTokenParse["cognito:username"],
          name: idTokenParse["name"],
          groups: idTokenParse["cognito:groups"],
          auth_time: idTokenParse["auth_time"]
        }

        const expiration_date = new Date().getTime() + data.expires_in * 1000;

        this.$cookies.set("IdToken", data.id_token, {
          expires: new Date(expiration_date),
          path: "/",
          domain: domainSSO,
        });
        this.$cookies.set("AccessToken", data.access_token, {
          expires: new Date(expiration_date),
          path: "/",
          domain: domainSSO,
        });
        this.$cookies.set("RefreshToken", data.refresh_token, {
          expires: new Date(expiration_date),
          path: "/",
          domain: domainSSO,
        });
        data.expiration_date = new Date(expiration_date);

        commit("setAuth", data, { root: true });

        const dataUserRegister = {
          tenant_id: idTokenParse["custom:tenant_id"],
          tenant_name: idTokenParse["custom:tenant_name"],
          user_id: idTokenParse["custom:user_id"],
          name: idTokenParse["name"],
          email: idTokenParse["email"],
          phone: idTokenParse["phone_number"],
          organization_id: "ORG00001",
          user_status_id: 2,
          app_id: 3,
          app_role_id: "ROLE0020"
        };
        await dispatch("library/InsertIgnoreError", {
          url: `/users/register`,
          request_body: dataUserRegister,
        }, {root: true});

        const get_app_user = await dispatch("library/GetAll", {
          url: `/tenants/${data.tenant_id}/apps`,
          params: {},
        }, { root: true });

        if(get_app_user.data.length > 0){
          let ref_url = get_app_user.data.filter(item => item.url.indexOf(state.referrer_url) !== -1 && item.is_registered === true)
          if(ref_url.length > 0) {
            window.location.href = ref_url[0].url
          }else{
            this.$router.push("/");
          }
        }else {
          this.$router.push("/");
        }
      } else {
        this.$cookies.removeAll({
          domain: domainSSO,
        });

        commit("setAuth", null, { root: true });
        this.$router.push({ name: "login" });
      }
    } catch (error) {
      console.log(error);
      let errorMessage = "An error occurred.";
      switch (error.code) {
        case "NotAuthorizedException":
          errorMessage =
            "Invalid username or password.";
          break;
        case "UserNotFoundException":
          errorMessage = "The user was not found.";
          break;
        case "UserNotConfirmedException":
          errorMessage =
            "The user has not been confirmed. Please confirm the user first.";
          break;
        case "PasswordResetRequiredException":
          errorMessage = "Password reset is required for the user.";
          break;
        case "ResourceNotFoundException":
          errorMessage =
            "The specified client or other resource was not found.";
          break;
        case "InvalidParameterException":
          errorMessage = "Invalid parameters were provided in the request.";
          break;
        case "InternalErrorException":
          errorMessage = "An internal server error occurred.";
          break;
        default:
          errorMessage = "An unknown error occurred.";
          break;
      }

      this.$cookies.removeAll({
        domain: domainSSO,
      });

      commit("setAuth", null, { root: true });

      throw errorMessage
    }
  },
  Logout: async function ({ commit }) {
    try {
      const accessToken = this.$cookies.get("AccessToken");
      
      let result = await this.$cognito.Logout(accessToken)

      this.$cookies.removeAll({
        domain: domainSSO,
      });

      commit("setAuth", null, {root: true});
      this.$router.push({ name: "login" });
      
    } catch (error) {
      this.$cookies.removeAll({
        domain: domainSSO,
      });

      commit("setAuth", null, { root: true });
      this.$router.push({ name: "login" });
    }
  },
  Forgot: async function ({ commit }, { email }) {
    try {
      let get_user = await this.$cognito.GetUser(email)
      if(get_user){
        await this.$cognito.ForgotPassword(email)
      }

      return true
    } catch (ex) {
      throw ex.message
    }
  },
  Reset: async function ({ commit }, { username, confirmation_code, password }) {
    try {
      const confirmResetParams = {
        username: username,
        confirmation_code: confirmation_code,
        password: password
      }

      await this.$cognito.ConfirmForgotPassword(confirmResetParams)

      return true
    } catch (ex) {
      throw ex.message
    }
  },
  ChangePassword: async function ({ commit, state }, payload) {
    try {
      const changePasswordParams = {
        access_token: payload.access_token,
        previous_password: payload.previous_password,
        proposed_password: payload.proposed_password
      }

      await this.$cognito.ChangePassword(changePasswordParams)
      return true
    } catch (err) {
      throw err.message;
    }
  },
};
