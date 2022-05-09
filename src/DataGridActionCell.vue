<template>
    <td>
        <div class="ww-data-grid-action-cell flex items-center">
            <!-- wwEditor:start -->
            <div v-if="id === undefined" class="message ww-typo-sub-text">Please provide an id path</div>
            <template v-else-if="!edit">
                <wwElement
                    v-bind="editButton"
                    @click="$emit('update:edit', !edit)"
                    @update:is-selected="onSelectionChanged('edit', $event)"
                ></wwElement>
                <wwElement
                    v-bind="deleteButton"
                    @click="$emit('delete')"
                    @update:is-selected="onSelectionChanged('delete', $event)"
                ></wwElement>
            </template>
            <template v-else>
                <wwElement
                    v-bind="validEditButton"
                    @click="$emit('validate')"
                    @update:is-selected="onSelectionChanged('valid', $event)"
                ></wwElement>
                <wwElement
                    v-bind="cancelButton"
                    @click="$emit('update:edit', false)"
                    @update:is-selected="onSelectionChanged('cancel', $event)"
                ></wwElement>
            </template>
            <!-- wwEditor:end -->
            <!-- wwFront:start -->
            <template v-if="!edit">
                <wwElement v-bind="editButton" @click="$emit('update:edit', !edit)"></wwElement>
                <wwElement v-bind="deleteButton" @click="$emit('delete')"></wwElement>
            </template>
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
        deleteButton: { type: Object, required: true },
        edit: { type: Boolean, default: false },
    },
    emits: ['update:edit', 'validate', 'delete', 'button-selected'],
    methods: {
        onSelectionChanged(key, value) {
            if (value) {
                this.$emit('button-selected', key);
            }
        },
    },
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
