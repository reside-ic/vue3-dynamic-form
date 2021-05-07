<template>
    <select class="form-control"
            v-model="valueInternal"
            :name="formControl.name"
            :required="formControl.required">
        <option v-if="!formControl.excludeNullOption" value>{{selectText}}</option>
        <option v-for="opt in formControl.options"
                :key="opt.id"
                :value="opt.id">
            {{opt.label}}
        </option>
    </select>
</template>

<script lang="ts">
    import {computed, defineComponent, onMounted, PropType} from "vue";
    import {BFormSelect} from "bootstrap-vue";
    import {SelectControl} from "./types";

    export default defineComponent({
        name: "DynamicFormSelect",
        props: {
            modelValue: { type: Object as PropType<SelectControl>, required: true },
            selectText: String
        },
        setup(props, context) {
            const valueInternal = computed(() => ({
                get() {
                    return props.modelValue.value || "";
                },
                set(newVal: string) {
                    context.emit("update:modelValue", {...props.modelValue, value: newVal});
                }
            }));

            onMounted(() => {
                if (props.modelValue.excludeNullOption && !props.modelValue.value) {
                    valueInternal.value.set(props.modelValue.options[0].id);
                }
            });

            return {valueInternal};
        },
        components: {
            BFormSelect
        }
    })
</script>
