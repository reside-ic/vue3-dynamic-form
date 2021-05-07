<template>
    <b-col :md="colWidth">
        <label v-if="formControl.label">{{formControl.label}}
            <span v-if="formControl.helpText"
                  class="icon-small"
                  v-tooltip="formControl.helpText">
                <help-circle-icon></help-circle-icon>
            </span>
            <span v-if="formControl.required" class="small" :class="{'text-danger': valueIsEmpty(formControl.value)}">({{requiredText}})</span>
        </label>
        <component :is="dynamicComponent"
                   v-model="formControlLocal"
                   :select-text="selectText"></component>
    </b-col>
</template>

<script lang="ts">
    import {BCol} from "bootstrap-vue";
    import {computed, defineComponent, PropType} from "vue";
    import DynamicFormSelect from "./DynamicFormSelect.vue";
    import {DynamicControl} from "./types";
    import DynamicFormNumberInput from "./DynamicFormNumberInput.vue";
    import {VTooltip} from 'v-tooltip'
    import {HelpCircleIcon} from "vue-feather-icons";

    export default defineComponent({
        name: "DynamicFormControl",
        model: {
            prop: "formControl",
            event: "change"
        },
        props: {
            modelValue: {type: Object as PropType<DynamicControl>, required: true},
            colWidth: String,
            requiredText: String,
            selectText: String
        },
        setup(props, context) {
            const formControlLocal = computed(() => ({
                get() {
                    return props.modelValue;
                },
                set(newVal: DynamicControl) {
                    context.emit("update:modelValue", newVal);
                }
            }));

            const dynamicComponent = computed(() => {
                switch (props.modelValue.type) {
                    case "select":
                        return "dynamic-form-select";
                    case "number":
                        return "dynamic-form-number-input";
                }
            });

            return {
                formControlLocal,
                dynamicComponent
            }
        },
        components: {
            BCol,
            DynamicFormNumberInput,
            DynamicFormSelect,
            HelpCircleIcon
        },
        directives: {
            tooltip: VTooltip
        }
    });
</script>
