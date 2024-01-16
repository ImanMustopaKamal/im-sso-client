const data = {
  message: {
    modal: {
      success: {
        action: "{{name}} was {{action}} successfully",
        register_app: "You're all set! Your registration for {{name}} is complete",
      },
      dialog: {
        confirm: "Are you sure you want to {{name}}?",
        add: "Are you sure you want to submit this {{name}}?",
        edit: "Are you sure you want to submit this {{name}}?",
        leave:
          "Are you sure you want to leave this page? Any changes will be lost",
        no_change: "You have not changed any data yet, do you want to be redirected to {{page}} page ?",
      },
      error: {
        no_data: "No data available",
        user_invalid: "Incorrect Employee ID or Password",
        user_group: "User does not have permission to access this resource",
        not_found: "{{name}} not found",
        timeout: "The connection has timed out. Please try again",
        session: "Your session has expired or your token is invalid. Please log in again",
        forbidden: "Authenticated user doesn't have access to the resource"
      }
    },
    form: {
      input: {
        required: "{{name}} is required",
        min:
          "{{name}} must be more than or equal {{min}}",
        max:
          "{{name}} must be less than or equal {{max}}",
        min_length:
          "{{name}} must be more than or equal {{min_length}} characters",
        max_length:
          "{{name}} must be less than or equal {{max_length}} characters",
        between_length: "{{name}} must be between {{min_length}} and {{max_length}} characters",
        must_length: "{{name}} length must be {{max_length}} characters",
        accept_text: "{{name}} accept {{require}}",
        select: "Please select a valid {{name}}",
        fill: "Please fill a valid {{name}}",
        same: "{{as}} do not match",
        unique: "{{name}} already exists",
        number: "{{name}} accept number only",
        password: "Password does not meet all criteria",
        upload: {
          file_size: "Maximum upload file size is {{limit}}",
          file_format: "Invalid format file attachment",
          file_format_message: "If you ignore this, the file cannot be uploaded"
        },
        all_input: "Some inputs are still problematic, please check again"
      },
      saved: "Your changes have been saved",
    },
    toast: {
      form_saved: "Your form has been successfully saved"
    }
  },
};

const data_html = {
  message: {
    modal: {
      dialog: {
        delete:
          '<span class="text-danger btn-secondary" style="padding: 0 3px;">{{value}}</span>',
      },
    },
  },
};

function flatten(object, separator = ".") {
  const isValidObject = (value) => {
    if (!value) {
      return false;
    }

    const isArray = Array.isArray(value);
    const isObject =
      Object.prototype.toString.call(value) === "[object Object]";
    const hasKeys = !!Object.keys(value).length;

    return !isArray && isObject && hasKeys;
  };

  const walker = (child, path = []) => {
    return Object.assign(
      {},
      ...Object.keys(child).map((key) =>
        isValidObject(child[key])
          ? walker(child[key], path.concat([key]))
          : { [path.concat([key]).join(separator)]: child[key] }
      )
    );
  };

  return Object.assign({}, walker(object));
}

export default {
  getMessage: function (name_key, value = {}) {
    let flatten_data = flatten(data);
    let flatten_data_html = "";
    let final_message = "";
    if (flatten_data.hasOwnProperty(name_key)) {
      final_message = flatten_data[name_key];
      if (final_message.includes("{{html:")) {
        flatten_data_html = flatten(data_html);
      }
      for (const key in value) {
        if (value.hasOwnProperty(key) && value[key] !== undefined) {
          if (final_message.includes(`{{html:${key}}}`)) {
            value[key] = flatten_data_html[name_key].replace(
              "{{value}}",
              value[key]
            );
            final_message = final_message.replace(
              `{{html:${key}}}`,
              value[key]
            );
          } else {
            final_message = final_message.replace(`{{${key}}}`, value[key]);
          }
        }
      }
    }
    return final_message;
  },
};
