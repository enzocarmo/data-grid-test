<template>
    <td class="ww-data-grid-cell">
        <wwElement
            v-if="element && element.uid"
            :ww-props="{ value: displayedValue, readonly: !edit }"
            :uid="element.uid"
            @element-event="onElementEvent"
        ></wwElement>
        <!-- wwEditor:start -->
        <div v-else class="message ww-typo-sub-text flex items-center">No component loaded</div>
        <!-- wwEditor:end -->
    </td>
</template>

<script>
import { ref, computed, watch, toRef } from 'vue';
export default {
    expose: ['internalValue', 'column'],
    props: {
        column: { type: Object, required: true },
        item: { type: Object, required: true },
        columnsElement: { type: Object, required: true },
        edit: { type: Boolean, default: false },
    },
    setup(props) {
        const value = computed(() => {
            if (!props.column) return undefined;
            return _.get(props.item, props.column.path);
        });
        const internalValue = ref(value.value);
        watch(toRef(props, 'edit'), (isEditing, wasEditing) => {
            if (isEditing && !wasEditing) {
                internalValue.value = value.value;
            }
        });

        return {
            setValue(value) {
                internalValue.value = value;
            },
            displayedValue: computed(() => {
                return props.edit ? internalValue.value : value.value;
            }),
            internalValue,
        };
    },
    computed: {
        type() {
            if (!this.element) return null;
            return this.element.type;
        },
        element() {
            if (!this.column) return null;
            return this.columnsElement[this.column.id];
        },
    },
    methods: {
        onElementEvent($event) {
            if ($event.type === 'update:value') {
                this.setValue($event.value);
            }
        },
    },
};
</script>

<style scoped lang="scss">
/* wwEditor:start */
.message {
    padding: var(--ww-spacing-02);
    color: var(--ww-color-theme-dark-800);
    background-color: var(--ww-color-theme-dark-50);
    border: 1px solid var(--ww-color-theme-dark-100);
}
/* wwEditor:end */
</style>
