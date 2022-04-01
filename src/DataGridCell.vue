<template>
    <td class="ww-data-grid-cell">
        <template v-if="column && element">
            <wwElement v-if="type === 'ww-text'" :ww-props="{ text: value }" :uid="element.uid"></wwElement>
            <wwElement v-else-if="['checkbox', 'custom'].includes(column.type)" :uid="element.uid"></wwElement>
            <!-- wwEditor:start -->
            <div v-else class="message ww-typo-sub-text flex items-center">No component loaded</div>
            <!-- wwEditor:end -->
        </template>
        <!-- wwEditor:start -->
        <div v-else class="message ww-typo-sub-text flex items-center">No component loaded</div>
        <!-- wwEditor:end -->
    </td>
</template>

<script>
export default {
    props: {
        column: { type: String, required: true },
        item: { type: Object, required: true },
        columnsElementRead: { type: Object, required: true },
        columnsElementWrite: { type: Object, required: true },
        edit: { type: Boolean, default: false },
    },
    computed: {
        value() {
            if (!this.column) return undefined;
            return _.get(this.item, this.column.path);
        },
        type() {
            if (!this.element) return null;
            return this.element.type;
        },
        element() {
            if (!this.column) return null;
            if (this.edit) {
                return this.columnsElementRead[this.column.id] || this.columnsElementWrite[this.column.id];
            } else {
                return this.columnsElementRead[this.column.id];
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
