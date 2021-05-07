<template>
    <b-form-input :name="formControl.name"
                  type="number"
                  :number="true"
                  v-model="valueInternal"
                  :min="formControl.min"
                  :max="formControl.max"
                  :required="formControl.required"></b-form-input>
</template>

<script lang="ts">
    import {defineComponent, PropType, computed} from "vue";
    import {BFormInput} from "bootstrap-vue";
    import {NumberControl} from "./types";

    export default defineComponent({
        name: "DynamicFormNumberInput",
        props: {
            modelValue: { type: Object as PropType<NumberControl>, required: true },
        },
        setup(props, context) {
            const valueInternal = computed(() => ({
                get() {
                    return props.modelValue.value;
                },
                set(newVal: string) {
                    context.emit("update:modelValue", {...props.modelValue, value: newVal});
                }
            }));

            return {valueInternal}
        },
        components: {
            BFormInput
        }
    })
</script>
