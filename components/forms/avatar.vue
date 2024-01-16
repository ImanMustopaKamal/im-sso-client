<template>
  <div>
    <input
      type="file"
      accept="image/*"
      ref="file"
      style="display: none"
      @change="OnFileSelected"
    />
    <div class="avatar-view-area">
      <img class="avatar-img" :src="imageView" />
      <a href="javascript:void(0)" class="avatar-action" @click="ChangeImage"
        >Change image</a
      >
    </div>

    <b-modal
      v-model="dialog"
      :centered="true"
      :no-close-on-backdrop="true"
      title="Preview"
      ok-title="Done"
      @ok="OnUpload"
    >
      <div v-if="image">
        <vue-advanced-cropper
          class="w-full"
          :src="image"
          :stencil-props="{ aspectRatio: 1 / 1 }"
          @change="CropperChange"
        >
        </vue-advanced-cropper>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      dialog: false,
      selectedFile: null,
      coordinates: null,
      image: null,
      imageCropped: null,
      imageView: null,
    };
  },
  created() {
    setTimeout(() => {
      this.imageView = this.src ? this.src : "/img/icon/building.jpg";
    }, 100);
  },
  methods: {
    ChangeImage() {
      this.$refs.file.value = null;
      this.$refs.file.click();
    },
    CropperChange({ coordinates, canvas }) {
      this.coordinates = coordinates;
      this.imageCropped = canvas.toDataURL();
    },
    OnFileSelected(event) {
      try {
        this.selectedFile = event.target.files[0];
        this.image = URL.createObjectURL(this.selectedFile);
        this.dialog = true;
      } catch {
        this.image = null;
        this.dialog = false;
      }
    },
    OnUpload() {
      const fd = new FormData();
      fd.append("logo_file", this.selectedFile, this.selectedFile.name);
      fd.append("height", this.coordinates.height);
      fd.append("width", this.coordinates.width);
      fd.append("left", this.coordinates.left);
      fd.append("top", this.coordinates.top);

      this.imageView = this.imageCropped;
      this.$emit("set", fd);
    },
  },
};
</script>

<style>
img {
  image-orientation: from-image;
}
.avatar-view-area {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  border: none;
  outline: none;
}
.avatar-action {
  position: absolute;
  margin-left: 220px;
}
.vue-advanced-cropper__background,
.vue-advanced-cropper__foreground {
  background-color: white;
  border: 1px solid #a2a2a2;
}
</style>
