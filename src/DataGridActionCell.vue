<template>
    <td>
        <div class="ww-data-grid-action-cell">
            <!-- wwEditor:start -->
            <div v-if="id === undefined" class="message ww-typo-sub-text">Please provide an id path</div>
            <!-- wwEditor:end -->
            <!-- wwFront:start -->
            <template v-if="false"></template>
            <!-- wwFront:end -->
            <template v-else>
                <wwElement
                    :class="{ 'hide-container': edit }"
                    v-bind="editContainer"
                    :ww-props="{ isFixed: true }"
                    @element-event="onEditContainerEvent"
                    @update:is-selected="onIsEditContainerSelected"
                ></wwElement>
                <wwElement
                    :class="{ 'hide-container': !edit }"
                    v-bind="editingContainer"
                    :ww-props="{ isFixed: true }"
                    @element-event="onEditingContainerEvent"
                    @update:is-selected="onIsEditingContainerSelected"
                ></wwElement>
            </template>
        </div>
    </td>
</template>

<script>
export default {
    props: {
        id: { type: undefined, required: true },
        editContainer: { type: Object, required: true },
        editingContainer: { type: Object, required: true },
        edit: { type: Boolean, default: false },
    },
    emits: ['update:edit', 'validate', 'delete', 'cancel'],
    methods: {
        onEditContainerEvent(event) {
            /* wwEditor:start */
            if (this.isEditing) return;
            /* wwEditor:end */
            if (event.type === 'click') {
                if (event.index === 0) {
                    // Edit button
                    this.$emit('update:edit', !this.edit);
                } else {
                    this.$emit('delete');
                }
            }
        },
        onEditingContainerEvent(event) {
            /* wwEditor:start */
            if (this.isEditing) return;
            /* wwEditor:end */
            if (event.type === 'click') {
                if (event.index === 0) {
                    this.$emit('validate');
                } else {
                    this.$emit('update:edit', false);
                }
            }
        },
        onIsEditContainerSelected(event) {
            if (event && this.edit) {
                this.$emit('update:edit', false);
            }
        },
        onIsEditingContainerSelected(event) {
            if (event && !this.edit) {
                this.$emit('update:edit', true);
            }
        },
    },
};
</script>

<style>
.ww-data-grid-action-cell > .hide-container {
    display: none !important;
}
</style>
<style lang="scss" scoped>
/* wwEditor:start */
.message {
    flex: 1;
    text-align: center;
    padding: var(--ww-spacing-02);
    color: var(--ww-color-theme-dark-800);
    background-color: var(--ww-color-theme-dark-50);
    border: 1px solid var(--ww-color-theme-dark-100);
}
/* wwEditor:end */
</style>
