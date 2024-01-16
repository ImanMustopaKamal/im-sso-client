<template>
  <div class="card">
    <div class="card-body">
      <form method="POST" action="?" @submit.prevent="HandleUpdate">
        <div class="form-group">
          <label for="name" class="control-label"
            >Name <span class="text-danger">*</span></label
          >
          <input
            v-model="form.name"
            id="name"
            type="text"
            class="form-control"
            name="name"
            tabindex="1"
            required=""
            autofocus=""
          />
        </div>
        <div class="form-group mt-2">
          <label for="email" class="control-label"
            >Email <span class="text-danger">*</span></label
          >
          <input
            v-model="form.email"
            id="email"
            type="email"
            class="form-control"
            name="email"
            tabindex="1"
            required=""
            autofocus=""
          />
        </div>
        <div class="form-group mt-2">
          <label for="phone" class="control-label"
            >Phone <span class="text-danger">*</span></label
          >
          <input
            v-model="form.phone"
            id="phone"
            type="text"
            class="form-control"
            name="phone"
            tabindex="1"
            required=""
            autofocus=""
            @input="FilterNonNumericCharacters"
          />
        </div>
        <div class="form-group mt-4">
          <div class="invalid-feedback" style="display: block">
            <span class="error-block text-danger">
              {{ this.form.error }}
            </span>
          </div>
        </div>
        <div class="mt-5 d-flex justify-content-between align-items-center">
          <nuxt-link class="text-decoration-none" to="/"
            ><i class="fa fa-arrow-left mr-1"></i> Return to
            Dashboard</nuxt-link
          >
          <button type="submit" class="btn btn-primary" tabindex="4">
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import HelperMessage from "@/helpers/messages";
import HelperText from "@/helpers/texts";
import FV from "@/helpers/form_validation";
export default {
  props: {
    additional_query: Object,
  },
  data() {
    return {
      form: {
        name: "",
        email: "",
        phone: "",
        error: null,
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth,
    }),
  },
  mounted() {
    this.GetUserInfo();
  },
  methods: {
    ...mapActions("library", ["Update"]),
    async GetUserInfo() {
      try {
        let params = {};
        let reqData = await this.$store.dispatch("library/GetAll", {
          url: `/tenants/${this.user.tenant_id}/users/${this.user.user_id}`,
          params,
        });
        if (reqData.data) {
          const reqDataResult = reqData.data[0];
          this.form = {
            name: reqDataResult.name,
            email: reqDataResult.email,
            phone: HelperText.PhoneNumberFormatted(reqDataResult.phone),
          };
        }
      } catch (ex) {}
    },
    Validation() {
      let schema = {
        Name: {
          data: this.form.name,
          required: true,
          minlength: 3,
          maxlength: 150,
        },
        Email: {
          data: this.form.email,
          required: true,
          type: "email",
        },
        "Phone Number": {
          data: this.form.phone,
          required: true,
          minlength: 10,
          maxlength: 14,
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
        name: this.form.name,
        email: this.form.email,
        phone: HelperText.PhoneNumberRecoverred(this.form.phone),
        organization_id: this.user.user_detail
          ? this.user.user_detail.organization_id
          : "ORG00001",
        business_unit_id: this.user.user_detail
          ? this.user.user_detail.business_unit_id
          : null,
        subunit_id: this.user.user_detail
          ? this.user.user_detail.subunit_id
          : null,
      };
      await this.Update({
        url: `/tenants/${this.user.tenant_id}/users/${this.user.user_id}`,
        request_body: data,
      })
        .then(() => {
          this.$emit(
            "Success",
            HelperMessage.getMessage("message.modal.success.action", {
              name: "Profile",
              action: "updated",
            }),
            this.OkLeave
          );
          this.$store.dispatch("refreshToken");
        })
        .catch((err) => {
          let error_code = err.error_code;
          let message = err.message;

          if (error_code && message) {
            if (error_code === 16) {
              this.$emit("Error", message, true);
            } else {
              this.$emit("Error", message, false);
            }
          } else {
            this.$emit("Error", message, false);
          }
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
