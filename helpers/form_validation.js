import helperMessage from '@/helpers/messages'

function check_required(key, value){
  if(value.required !== undefined && value.required === true){
    if(value.data === "" || value.data === null || value.data === undefined || value.data.length === 0){
      return helperMessage.getMessage('message.form.input.required', {
        name: key
      })
    }
  }

  return null
}
function check_type(key, value){
  if(value.type !== undefined){
    if(value.data){
      if(value.type === "alphabet" && !/^[a-zA-Z ]*$/g.test(value.data)){
        return helperMessage.getMessage('message.form.input.accept_text', {
          name: key,
          require: 'alphabetical only'
        })
      }
      if(value.type === "alphanum" && !/^[a-zA-Z0-9 ]*$/g.test(value.data)){
        return helperMessage.getMessage('message.form.input.accept_text', {
          name: key,
          require: 'alphanumeric only'
        })
      }
      if(value.type === "alphabet_no_space" && !/^[a-zA-Z]*$/g.test(value.data)){
        return helperMessage.getMessage('message.form.input.accept_text', {
          name: key,
          require: 'alphabetical without space only'
        })
      }
      if(value.type === "alphanum_no_space" && !/^[a-zA-Z0-9]*$/g.test(value.data)){
        return helperMessage.getMessage('message.form.input.accept_text', {
          name: key,
          require: 'alphanumeric without space only'
        })
      }
      if(value.type === "alphabet_and_basic_symbol" && !/^[a-zA-Z-/%)(><., ]*$/g.test(value.data)){
        return helperMessage.getMessage('message.form.input.accept_text', {
          name: key,
          require: 'alphabetical and -/%)(><., only'
        })
      }
      if(value.type === "alphanum_and_basic_symbol" && !/^[a-zA-Z0-9-/%)(><., ]*$/g.test(value.data)){
        return helperMessage.getMessage('message.form.input.accept_text', {
          name: key,
          require: 'alphanumeric and -/%)(><., only'
        })
      }
      if(value.type === "number" && !/^[0-9]*$/g.test(value.data)){
        return helperMessage.getMessage('message.form.input.accept_text', {
          name: key,
          require: 'number only'
        })
      }
      if(value.type === "phone" && !/^(\+62|62|0)(2|8)[1-9][0-9]{6,12}$/g.test(value.data)){
        return helperMessage.getMessage('message.form.input.fill', {name: 'phone number'})
      }
      if(value.type === "email" && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(
        value.data
      )){
        return helperMessage.getMessage('message.form.input.fill', {name: 'email address'})
      }
      if(value.type === "date_range" && !/^\d{4}-\d{2}-\d{2}\/\d{4}-\d{2}-\d{2}$/g.test(value.data)){
        return helperMessage.getMessage('message.form.input.fill', {name: 'date range'})
      }
      if(value.type === "link" && !/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(value.data)){
        return helperMessage.getMessage('message.form.input.fill', {name: 'link'})
      }
      if(value.type === "file"){
        if(value.whitelist_ext && value.data.extension){
          if(!value.whitelist_ext.includes(value.data.extension)){
            return helperMessage.getMessage('message.form.input.upload.file_format')
          }
        }
        if(value.max_file_size && value.data.size){
          if(value.data.size > value.max_file_size){
            return helperMessage.getMessage('message.form.input.upload.file_size', {
              limit: '2 Mb'
            })
          }
        }
      }
      if(value.type === "code" && !/^[a-zA-Z0-9-.]*$/g.test(value.data)){
        return helperMessage.getMessage('message.form.input.accept_text', {
          name: key,
          require: 'alphanumeric, no space, dot and dash only'
        })
      }
      if(value.type === "custom" && value.pattern !== undefined && value.message !== undefined){
        if(!value.pattern.test(value.data)){
          return value.message
        }
      }
      if(value.type === "password") {
        if(!check_password(value.data)){
          return helperMessage.getMessage('message.form.input.password')
        }
      }
    }
  }

  return null
}
function check_password(data) {
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[^A-Za-z0-9]/;
  const hasUppercase = uppercaseRegex.test(data);
  const hasLowercase = lowercaseRegex.test(data);
  const hasNumber = numberRegex.test(data);
  const hasSpecialChar = specialCharRegex.test(data);
  if (hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
    return true;
  } else {
    return false;
  }
}
function check_mustlength(key, value){
  if(value.must_length !== undefined){
    if(value.data !== undefined && value.data.length !== value.must_length){
      return helperMessage.getMessage('message.form.input.must_length', {
        name: key,
        max_length: value.must_length,
      })
    }
  }

  return null
}
function check_min(key, value){
  if(value.min){
    if(value.data && value.data < value.min){
      return helperMessage.getMessage('message.form.input.min', {
        name: key,
        min: value.min,
      })
    }
  }

  return null
}
function check_max(key, value){
  if(value.max){
    if(value.data && value.data > value.max){
      return helperMessage.getMessage('message.form.input.max', {
        name: key,
        max: value.max,
      })
    }
  }

  return null
}
function check_minlength(key, value){
  if(value.minlength !== undefined){
    if(value.data && value.data.length < value.minlength){
      return helperMessage.getMessage('message.form.input.min_length', {
        name: key,
        min_length: value.minlength,
      })
    }
  }

  return null
}
function check_maxlength(key, value){
  if(value.maxlength !== undefined){
    if(value.data && value.data.length > value.maxlength){
      return helperMessage.getMessage('message.form.input.max_length', {
        name: key,
        max_length: value.maxlength,
      })
    }
  }

  return null
}
function check_betweenlength(key, value){
  if(value.betweenlength !== undefined){
    if(value.data !== undefined && (value.data.length < value.between.minlength || value.data.length > value.between.maxlength)){
      return helperMessage.getMessage('message.form.input.between_length', {
        name: key,
        min_length: value.between.minlength,
        max_length: value.between.maxlength,
      })
    }
  }

  return null
}
function check_valid(key, value){
  let state = 0
  if(value.valid !== undefined){
    if(Array.isArray(value.valid)){
      let valid_key = value.valid_key !== undefined ? value.valid_key : 'value'
      if(value.multiple && value.data) {
        let check_data = value.valid.filter(item => value.data.includes(item[valid_key]))
        let is_matched = check_data.length === value.data.length
        if(!is_matched){
          state = 1
        }
      }else {
        if(value.data && value.valid.filter(x => x[valid_key] === value.data).length < 1){
          state = 1
        }
      }
    }else{
      if(value.data && value.valid !== value.data){
        state = 1
      }
    }

    if(state === 1){
      if(value.custom_valid_message !== undefined){
        return value.custom_valid_message
      }else{
        return helperMessage.getMessage('message.form.input.select', {
          name: key
        })
      }
    }
  }

  return null
}
function check_same(key, value){
  if(value.same !== undefined){
    if(value.data && value.data != value.same){
      return helperMessage.getMessage('message.form.input.same', {
        name: key,
        as: value.sameas,
      })
    }
  }

  return null
}
function do_validation(schema, return_type){
  let message = return_type === 'multiple' ? {} : ''
  for (const [key, value] of Object.entries(schema)) {
    let cr = check_required(key, value)
    if(cr !== null) { 
      if(typeof message === 'object'){
        message[key] = cr
        continue;
      }else{
        message = cr
        break;
      }
    }

    let ct = check_type(key, value)
    if(ct !== null) { 
      if(typeof message === 'object'){
        message[key] = ct
        continue;
      }else{
        message = ct
        break;
      }
    }

    let cmu = check_mustlength(key, value)
    if(cmu !== null) { 
      if(typeof message === 'object'){
        message[key] = cmu
        continue;
      }else{
        message = cmu
        break;
      }
    }

    let cmi = check_minlength(key, value)
    if(cmi !== null) { 
      if(typeof message === 'object'){
        message[key] = cmi
        continue;
      }else{
        message = cmi
        break;
      }
    }

    let cma = check_maxlength(key, value)
    if(cma !== null) { 
      if(typeof message === 'object'){
        message[key] = cma
        continue;
      }else{
        message = cma
        break;
      }
    }

    let cmn = check_min(key, value)
    if(cmn !== null) { 
      if(typeof message === 'object'){
        message[key] = cmn
        continue;
      }else{
        message = cmn
        break;
      }
    }

    let cmx = check_max(key, value)
    if(cmx !== null) { 
      if(typeof message === 'object'){
        message[key] = cmx
        continue;
      }else{
        message = cmx
        break;
      }
    }

    let cb = check_betweenlength(key, value)
    if(cb !== null) { 
      if(typeof message === 'object'){
        message[key] = cb
        continue;
      }else{
        message = cb
        break;
      }
    }

    let cv = check_valid(key, value)
    if(cv !== null) { 
      if(typeof message === 'object'){
        message[key] = cv
        continue;
      }else{
        message = cv
        break;
      }
    }

    let same = check_same(key, value)
    if(same !== null) { 
      if(typeof message === 'object'){
        message[key] = same
        continue;
      }else{
        message = same
        break;
      }
    }
  }

  return message
}

export default {
  validation: function(schema, return_type = 'single') {
    return do_validation(schema, return_type)
  }
}