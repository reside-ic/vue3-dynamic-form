<template>
    <b-row class="my-2">
        <label v-if="controlGroup.label" class="col-form-label col-md-5">{{controlGroup.label}}
            <span v-if="helpText" class="icon-small" v-tooltip="helpText">
                    <help-circle-icon></help-circle-icon>
                </span>
            <span v-if="required" class="small" :class="{'text-danger': anyValueEmpty(controlGroup)}">({{requiredText}})</span>
        </label>
        <dynamic-form-control v-for="(control, index) in controlGroup.controls"
                              :key="control.name"
                              :form-control="control"
                              @mousedown.native="confirm"
                              @click.native="confirm"
                              :required-text="requiredText"
                              :select-text="selectText"
                              @change="change($event, index)"
                              :col-width="colWidth"></dynamic-form-control>
    </b-row>
</template>
<script lang="ts">
    import {BCol, BRow} from "bootstrap-vue";
    import {computed, defineComponent, PropType} from "vue";
    import {Control, DynamicControlGroup} from "./types";
    import DynamicFormControl from "./DynamicFormControl.vue";
    import {VTooltip} from 'v-tooltip';
    import {HelpCircleIcon} from "vue-feather-icons";
    import FormsUtils from "./FormsUtils";

    export default defineComponent({
        name: "DynamicFormControlGroup",
        props: {
            modelValue: { type: Object as PropType<DynamicControlGroup>, required: true},
            requiredText: String,
            selectText: String
        },
        setup(props, context) {
            const utils = FormsUtils();

            function anyValueEmpty(controlGroup: DynamicControlGroup){
                return !!controlGroup.controls.find(c => utils.valueIsEmpty(c.value))
            }

            function change(newVal: Control, index: number) {
                const controls = [...props.modelValue.controls];
                controls[index] = newVal;
                context.emit("update:modelValue", {...props.modelValue, controls})
            }

            function confirm(e: Event) {
               context.emit("confirm", e)
            }

            const colWidth = computed(() => {
                const numCols = props.modelValue.controls.length;
                if (numCols == 1) {
                    return "6"
                } else {
                    return "3"
                }
            });

            const required = computed(() => {
                return props.modelValue.controls.length == 1
                    && props.modelValue.controls[0].required
            });

            const helpText = computed(() => {
                return props.modelValue.controls.length == 1 ?
                    props.modelValue.controls[0].helpText : ""
            });

            return {
                anyValueEmpty,
                change,
                confirm,
                colWidth,
                required,
                helpText
            }
        },
        components: {
            BRow,
            BCol,
            DynamicFormControl,
            HelpCircleIcon
        }
    });

</script>
