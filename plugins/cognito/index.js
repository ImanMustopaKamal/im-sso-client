import * as AWS from 'aws-sdk'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.POOL_REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
});

export default ({ app, store }, inject) => {
  inject('cognito', {
    async Login(username, password) {
      const params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      };
    
      try {
        const result = await cognito.initiateAuth(params).promise();
        return result.AuthenticationResult;
      } catch (error) {
        throw error;
      }
    },
    async Logout(access_token) {
      const params = {
        AccessToken: access_token,
      };
    
      try {
        await cognito.globalSignOut(params).promise();
      } catch (error) {
        throw error;
      }
    },
    async RefreshToken(refresh_token) {
      const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthFlow: "REFRESH_TOKEN_AUTH",
        AuthParameters: {
          REFRESH_TOKEN: refresh_token,
        },
      };
    
      try {
        const result = await cognito.initiateAuth(params).promise();
        return result.AuthenticationResult;
      } catch (error) {
        throw error;
      }
    },
    async GetUser(username) {
      return await new Promise((resolve, reject) => {
        var params = {
          Username: username,
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
        };
  
        cognito.adminGetUser(params, (err, results) => {
          if (err) {
            reject(err);
          }
  
          resolve(results);
        });
      });
    },
    async AdminCreateUser(body) {
    return await new Promise((resolve, reject) => {
      var params = {
        Username: body.username,
        DesiredDeliveryMediums: ["EMAIL"],
        TemporaryPassword: body.password,
        UserAttributes: body.user_attributes,
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
      };

      cognito.adminCreateUser(params, (err, results) => {
        if (err) {
          reject(err);
        }

        resolve(results);
      });
    });
    },
    async AdminUpdateUser(body) {
      return await new Promise((resolve, reject) => {
        var list_attribute = [];
        var user_attributes = body.user_attributes;
        for (var i = 0; i < user_attributes.length; i++) {
          if (
            user_attributes[i].hasOwnProperty("name") &&
            user_attributes[i].hasOwnProperty("value")
          ) {
            if (
              user_attributes[i].name == "name" ||
              user_attributes[i].name == "email" ||
              user_attributes[i].name == "email_verified"
            ) {
              list_attribute.push(
                new AmazonCognitoIdentity.CognitoUserAttribute({
                  Name: user_attributes[i].name,
                  Value: user_attributes[i].value,
                })
              );
            } else {
              list_attribute.push(
                new AmazonCognitoIdentity.CognitoUserAttribute({
                  Name: "custom:" + user_attributes[i].name,
                  Value: user_attributes[i].value,
                })
              );
            }
          }
        }

        var params = {
          Username: body.username,
          UserAttributes: list_attribute,
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
        };

        cognito.adminUpdateUserAttributes(params, (err, results) => {
          if (err) {
            reject(err);
          }

          resolve(results);
        });
      });
    },
    async AdminDeleteUser(username) {
      return await new Promise((resolve, reject) => {
        var params = {
          Username: username,
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
        };

        cognito.adminDeleteUser(params, (err, results) => {
          if (err) {
            reject(err);
          }

          resolve(results);
        });
      });
    },
    async AdminAddUserToGroup (username, group_name) {
      return await new Promise((resolve, reject) => {
        var params = {
          GroupName: group_name,
          Username: username,
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
        };

        cognito.adminAddUserToGroup(params, (err, results) => {
          if (err) {
            reject(err);
          }

          resolve(results);
        });
      });
    },
    async AdminRemoveUserFromGroup (username, group_name) {
      return await new Promise((resolve, reject) => {
        var params = {
          GroupName: group_name,
          Username: username,
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
        };

        cognito.adminRemoveUserFromGroup(params, (err, results) => {
          if (err) {
            reject(err);
          }

          resolve(results);
        });
      });
    },
    async AdminChangePassword (username, password, permanent = false) {
      return await new Promise((resolve, reject) => {
        var params = {
          Username: username,
          Password: password,
          Permanent: permanent,
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
        };

        cognito.adminSetUserPassword(params, (err, results) => {
          if (err) {
            reject(err);
          }

          resolve(results);
        });
      });
    },
    async UserChangePassword(
      access_token,
      previous_password,
      proposed_password
    ) {
      return await new Promise((resolve, reject) => {
        var params = {
          AccessToken: access_token,
          PreviousPassword: previous_password,
          ProposedPassword: proposed_password,
        };

        cognito.changePassword(params, (err, results) => {
          if (err) {
            reject(err);
          }

          resolve(results);
        });
      });
    },
    async AdminUserGlobalSignOut (username) {
      return await new Promise((resolve, reject) => {
        var params = {
          Username: username,
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
        };

        cognito.adminUserGlobalSignOut(params, (err, results) => {
          if (err) {
            reject(err);
          }

          resolve(results);
        });
      });
    },
    async SignUp({ tenant_id, tenant_name, user_id, name, email, phone_number, password }) {
      const emailCheckParams = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        AttributesToGet: ["email", "email_verified"],
        Filter: `email = "${email}"`,
      };
    
      try {
        const emailCheckResult = await cognito.listUsers(emailCheckParams).promise();
    
        // Check if the email already exists
        if (emailCheckResult.Users && emailCheckResult.Users.length > 0) {
          const existingUser = emailCheckResult.Users[0];
    
          // Check if the email is verified
          if (existingUser.Attributes.find(attr => attr.Name === 'email_verified' && attr.Value === 'true')) {
            throw new Error("Email address is already in use.");
          } else {
            throw new Error("registered_not_verify");
          }
        }
    
        const signUpParams = {
          ClientId: process.env.COGNITO_CLIENT_ID,
          Username: user_id,
          Password: password,
          UserAttributes: [
            { Name: "name", Value: name },
            { Name: "email", Value: email },
            { Name: "phone_number", Value: phone_number },
            { Name: "custom:user_id", Value: user_id },
            { Name: "custom:tenant_id", Value: tenant_id },
            { Name: "custom:tenant_name", Value: tenant_name },
          ],
        };
    
        const addUserToGroupParams = {
          GroupName: "AccountOwner",
          Username: user_id,
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
        };
    
        const signUpResult = await cognito.signUp(signUpParams).promise();
        await cognito.adminAddUserToGroup(addUserToGroupParams).promise();
    
        return signUpResult;
      } catch (error) {
        throw error;
      }
    },       
    async ConfirmSignUp({ username, confirmation_code }) {
      const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: username,
        ConfirmationCode: confirmation_code
      };
    
      try {
        const result = await cognito.confirmSignUp(params).promise();
        return result;
      } catch (error) {
        throw error;
      }
    },
    async ResendConfirmationCode(username) {
      const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: username
      };

      try {
        const result = await cognito.resendConfirmationCode(params).promise();
        return result;
      } catch (error) {
        throw error;
      }
    },
    async UpdateAttribute({ username, userAttributes }) {
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
        UserAttributes: userAttributes,
      };
    
      try {
        const result = await cognito.adminUpdateUserAttributes(params).promise();
        return result;
      } catch (error) {
        throw error;
      }
    },
    async ForgotPassword(username) {
      const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: username
      };
    
      try {
        const result = await cognito.forgotPassword(params).promise();
        return result;
      } catch (error) {
        throw error;
      }
    },
    async ConfirmForgotPassword({ username, confirmation_code, password }) {
      const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: username,
        ConfirmationCode: confirmation_code,
        Password: password
      };
    
      try {
        const result = await cognito.confirmForgotPassword(params).promise();
        return result;
      } catch (error) {
        throw error;
      }
    },
    async ChangePassword({ access_token, previous_password, proposed_password }) {
      const params = {
        AccessToken: access_token,
        PreviousPassword: previous_password,
        ProposedPassword: proposed_password
      };
    
      try {
        const result = await cognito.changePassword(params).promise();
        return result;
      } catch (error) {
        throw error;
      }
    },
  })
};
