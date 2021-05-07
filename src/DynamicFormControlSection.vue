<template>
    <div>
        <h3 @click="toggleSection" :class="{'cursor-pointer': modelValue.collapsible}">
            {{modelValue.label}}
            <component v-if="modelValue.collapsible"
                       style="vertical-align: initial"
                       :is="chevronComponent"></component>
        </h3>
        <b-collapse v-model="open">
            <p v-if="modelValue.description" class="text-muted">{{modelValue.description}}</p>
            <dynamic-form-control-group v-for="(group, index) in modelValue.controlGroups"
                                        :key="index"
                                        :control-group="group"
                                        @confirm="confirm"
                                        :required-text="requiredText"
                                        :select-text="selectText"
                                        @change="change($event, index)"></dynamic-form-control-group>
            <b-row v-if="modelValue.documentation" class="documentation mb-4">
                <b-col>
                    <a href="#" @click="toggleDocumentation">
                        <info-icon></info-icon>
                        How to use these settings
                        <component style="vertical-align: top"
                                   :is="documentationChevronComponent"></component>
                    </a>
                    <b-collapse v-model="showDocumentation">
                        <div class="my-1" v-html="modelValue.documentation"></div>
                    </b-collapse>
                </b-col>
            </b-row>
        </b-collapse>
    </div>
</template>

<script lang="ts">

    import {computed, defineComponent, onMounted, PropType, ref} from "vue";
    import DynamicFormControlGroup from "./DynamicFormControlGroup.vue";
    import {DynamicControlGroup, DynamicControlSection} from "./types";
    import {InfoIcon, ChevronDownIcon, ChevronUpIcon} from "vue-feather-icons";
    import {BCollapse, BRow, BCol} from "bootstrap-vue";

    export default defineComponent({
        name: "DynamicFormmodelValue",
        props: {
            modelValue: {
                type: Object as PropType<DynamicControlSection>,
                required: true
            },
            requiredText: String,
            selectText: String
        },
        setup(props, context) {
            const showDocumentation = ref(false);
            const open  = ref(true);

            const chevronComponent = computed(() => {
                if (open.value) {
                    return "chevron-up-icon"
                }
                return "chevron-down-icon"
            });

            const documentationChevronComponent = computed(() => {
                if (showDocumentation.value) {
                    return "chevron-up-icon"
                }
                return "chevron-down-icon";
            });

            function change(newVal: DynamicControlGroup, index: number) {
                const controlGroups = [...props.modelValue.controlGroups];
                controlGroups[index] = newVal;
                context.emit("update:modelValue", {...props.modelValue, controlGroups})
            }

            function toggleDocumentation(e: Event) {
                e.preventDefault();
                showDocumentation.value = !showDocumentation.value
            }

            function toggleSection() {
                if (props.modelValue.collapsible) {
                    open.value = !open.value;
                }
            }

            function confirm(e: Event) {
                context.emit("confirm", e)
            }

            onMounted(() => {
                if (props.modelValue.collapsible && props.modelValue.collapsed) {
                    open.value = false
                }
            });

            return {
                showDocumentation,
                open,
                chevronComponent,
                change,
                toggleDocumentation,
                toggleSection,
                confirm
            }
        },
        components: {
            DynamicFormControlGroup,
            InfoIcon,
            ChevronDownIcon,
            ChevronUpIcon,
            BCollapse,
            BRow,
            BCol
        }
    })
</script>
