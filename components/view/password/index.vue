<template>
  <div class="card">
    <div class="card-body">
      <div class="mt-2">
        <p><b>Password Criteria</b></p>
        <ul>
          <li>At least one uppercase letter (A-Z)</li>
          <li>At least one lowercase letter (a-z)</li>
          <li>At least one number (0-9)</li>
          <li>At least one special character (e.g., @, #, $)</li>
        </ul>
      </div>
      <hr />
      <form
        class="mt-2"
        method="POST"
        action="?"
        @submit.prevent="HandleUpdate"
      >
        <div class="form-group">
          <label for="current-password" class="control-label"
            >Current Password <span class="text-danger">*</span></label
          >
          <div class="input-group">
            <input
              v-model="form.previous_password"
              id="previous_password"
              :type="form.previous_password_mask ? 'text' : 'password'"
              class="form-control"
              name="previous_password"
              required=""
              autofocus=""
            />
            <div class="input-group-append">
              <div
                class="input-group-text"
                style="cursor: pointer"
                :style="form.previous_password_mask ? 'display: none;' : ''"
                @click="
                  form.previous_password_mask = !form.previous_password_mask
                "
              >
                <i class="fas fa-eye"></i>
              </div>
              <div
                class="input-group-text"
                style="cursor: pointer"
                :style="form.previous_password_mask ? '' : 'display: none;'"
                @click="
                  form.previous_password_mask = !form.previous_password_mask
                "
              >
                <i class="fas fa-eye-slash"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group mt-2">
          <label for="new-password" class="control-label"
            >New Password <span class="text-danger">*</span></label
          >
          <div class="input-group">
            <input
              v-model="form.new_password"
              id="new_password"
              :type="form.new_password_mask ? 'text' : 'password'"
              class="form-control"
              name="new_password"
              required=""
              autofocus=""
            />
            <div class="input-group-append">
              <div
                class="input-group-text"
                style="cursor: pointer"
                :style="form.new_password_mask ? 'display: none;' : ''"
                @click="
                  form.new_password_mask = !form.new_password_mask
                "
              >
                <i class="fas fa-eye"></i>
              </div>
              <div
                class="input-group-text"
                style="cursor: pointer"
                :style="form.new_password_mask ? '' : 'display: none;'"
                @click="
                  form.new_password_mask = !form.new_password_mask
                "
              >
                <i class="fas fa-eye-slash"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group mt-2">
          <label for="confirm-new-password" class="control-label"
            >Confirm New Password <span class="text-danger">*</span></label
          >
          <div class="input-group">
            <input
              v-model="form.confirm_new_password"
              id="confirm_new_password"
              :type="form.confirm_new_password_mask ? 'text' : 'password'"
              class="form-control"
              name="confirm_new_password"
              required=""
              autofocus=""
            />
            <div class="input-group-append">
              <div
                class="input-group-text"
                style="cursor: pointer"
                :style="form.confirm_new_password_mask ? 'display: none;' : ''"
                @click="
                  form.confirm_new_password_mask = !form.confirm_new_password_mask
                "
              >
                <i class="fas fa-eye"></i>
              </div>
              <div
                class="input-group-text"
                style="cursor: pointer"
                :style="form.confirm_new_password_mask ? '' : 'display: none;'"
                @click="
                  form.confirm_new_password_mask = !form.confirm_new_password_mask
                "
              >
                <i class="fas fa-eye-slash"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group mt-4">
          <div class="invalid-feedback" style="display: block">
            <span class="error-block text-danger">
              {{ this.form.error }}
            </span>
          </div>
        </div>
        <div class="mt-5 d-flex justify-content-end align-items-center">
          <button type="submit" class="btn btn-primary" tabindex="4">
            Change Password
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import HelperMessage from "@/helpers/messages";
import FV from "@/helpers/form_validation";
export default {
  props: {
    additional_query: Object,
  },
  data() {
    return {
      form: {
        previous_password: "",
        previous_password_mask: false,
        new_password: "",
        new_password_mask: false,
        confirm_new_password: "",
        confirm_new_password_mask: "",
        error: null,
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth,
    }),
  },
  methods: {
    ...mapActions("authentication", ["ChangePassword"]),
    Validation() {
      let schema = {
        "Current Password": {
          data: this.form.previous_password,
          required: true,
        },
        "New Password": {
          data: this.form.new_password,
          required: true,
          type: "password",
          minlength: 10,
        },
        "Confirm New Password": {
          data: this.form.confirm_new_password,
          required: true,
          minlength: 10,
          same: this.form.new_password,
          sameas: "New Password",
        },
      };

      return FV.validation(schema, "single");
    },
    async HandleUpdate() {
      let do_validation = this.Validation();
      if (do_validation) {
        this.form.error = do_validation;
        this.$emit("Error", do_validation, true);
      } else {
        await this.UpdateSubmit();
      }
    },
    async UpdateSubmit() {
      this.$emit("ShowLoader", true);
      const data = {
        access_token: this.user.access_token,
        previous_password: this.form.previous_password,
        proposed_password: this.form.new_password,
      };
      await this.ChangePassword(data)
        .then((res) => {
          console.log(res);
          this.$emit(
            "Success",
            HelperMessage.getMessage("message.modal.success.action", {
              name: "Change Password",
              action: "updated",
            }),
            this.OkLeave
          );
          this.$store.dispatch("refreshToken");
        })
        .catch((err) => {
          this.form.error = err;
          this.$emit("Error", err);
        });
      this.$emit("ShowLoader", false);
    },
    OkLeave() {
      this.$router.push({ name: "index" });
    },
    FilterNonNumericCharacters() {
      this.form.phone = this.form.phone.replace(/\D/g, "");
    },
  },
};
</script>
