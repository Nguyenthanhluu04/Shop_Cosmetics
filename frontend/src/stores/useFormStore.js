
import { defineStore } from "pinia"
import { ref } from "vue";

export const useFormStore = defineStore('formStore', () => {

    const isShowForm = ref(false);
    const isEdit = ref(false);

    const handleIsShowForm = () => {
        isShowForm.value = !isShowForm.value;
    }

    return { isShowForm ,isEdit, handleIsShowForm}

})