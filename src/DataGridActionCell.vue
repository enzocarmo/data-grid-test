<template>
    <td>
        <div class="ww-data-grid-action-cell flex items-center">
            <!-- wwEditor:start -->
            <div v-if="id === undefined" class="message ww-typo-sub-text">Please provide an id path</div>
            <wwElement v-else-if="!edit" v-bind="editButton" @click="$emit('update:edit', !edit)"></wwElement>
            <template v-else>
                <wwElement v-bind="validEditButton" @click="$emit('validate')"></wwElement>
                <wwElement v-bind="cancelButton" @click="$emit('update:edit', false)"></wwElement>
            </template>
            <!-- wwEditor:end -->
            <!-- wwFront:start -->
            <wwElement v-if="!edit" v-bind="editButton" @click="$emit('update:edit', !edit)"></wwElement>
            <template v-else>
                <wwElement v-bind="validEditButton" @click="$emit('validate')"></wwElement>
                <wwElement v-bind="cancelButton" @click="$emit('update:edit', false)"></wwElement>
            </template>
            <!-- wwFront:end -->
        </div>
    </td>
</template>

<script>
export default {
    props: {
        id: { type: undefined, required: true },
        editButton: { type: Object, required: true },
        validEditButton: { type: Object, required: true },
        cancelButton: { type: Object, required: true },
        edit: { type: Boolean, default: false },
    },
    emits: ['update:edit', 'validate'],
};
</script>

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
