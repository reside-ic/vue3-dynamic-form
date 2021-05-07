<template>
    <b-form :ref="id" :id="id" class="dynamic-form" novalidate>
        <dynamic-form-control-section v-for="(section, index) in modelValue.controlSections"
                                      :key="index"
                                      :control-section="section"
                                      @confirm="confirm"
                                      :required-text="requiredText"
                                      :select-text="selectText"
                                      @change="change($event, index)">
        </dynamic-form-control-section>
        <button v-if="includeSubmitButton"
                class="btn"
                :class="disabled? 'btn-secondary' : 'btn-submit'"
                :disabled="disabled"
                v-on:click="submit">{{submitText}}
        </button>
    </b-form>
</template>

<script lang="ts">

    import {computed, defineComponent, onMounted, PropType, watch} from "vue";
    import {BForm} from "bootstrap-vue";
    import DynamicFormControlGroup from "./DynamicFormControlGroup.vue";
    import DynamicFormControlSection from "./DynamicFormControlSection.vue";
    import {
        Control,
        DynamicControl,
        DynamicControlSection,
        DynamicFormData,
        DynamicFormMeta
    } from "./types";

    export default defineComponent({
        name: "DynamicForm",
        props: {
            id: {
                type: String,
                default: "d-form"
            },
            submitText: {
                type: String,
                default: "Submit"
            },
            includeSubmitButton: {
                type: Boolean,
                default: true
            },
            modelValue: {
                type: Object as PropType<DynamicFormMeta>,
                required: true
            },
            requiredText: {
                type: String,
                default: "required"
            },
            selectText: {
                type: String,
                default: "Select..."
            }
        },
        setup(props, context) {

            const controls = computed(() => {
                const controls: Control[] = [];
                props.modelValue.controlSections.map(s => {
                    s.controlGroups.map(g => {
                        g.controls.map(c => {
                            controls.push(c);
                        })
                    })
                });
                return controls;
            });

            const disabled = computed(() => {
                return controls.value
                    .filter(c => c.required && (c.value == null || c.value == ""))
                    .length > 0
            });

            function change(newVal: DynamicControlSection, index: number) {
                const controlSections = [...props.modelValue.controlSections];
                controlSections[index] = newVal;
                context.emit("update:modelValue", {...props.modelValue, controlSections})
            }

            function buildValue(control: DynamicControl) {
                return control.value == undefined ? null : control.value;
            }

            function submit(e: Event) {
                if (e) {
                    e.preventDefault();
                }
                const result = controls.value
                    .reduce((formData, control) => {
                        formData[control.name] = buildValue(control);
                        return formData
                    }, {} as DynamicFormData);
                context.emit("submit", result);
                return result;
            }

            function confirm(e: Event) {
                context.emit("confirm", e)
            }

            props.modelValue.controlSections.map((s: DynamicControlSection) => {
                s.controlGroups.map(g => {
                    g.controls.map(c => {
                        c.value = buildValue(c)
                    })
                })
            });

            onMounted(() => {
                context.emit("validate", !disabled.value);
            });

            watch(disabled, (value: Boolean) => {
                context.emit("validate", !value);
            });

            return {
                controls,
                disabled,
                change,
                buildValue,
                submit,
                confirm
            }
        },
        components: {
            BForm,
            DynamicFormControlGroup,
            DynamicFormControlSection
        }
    })
</script>
