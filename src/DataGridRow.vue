<template>
    <tr>
        <DataGridCell
            v-for="column in columns"
            :key="column.id"
            :ref="el => registerCellRef(column.id, el)"
            :column="column"
            :item="item"
            :edit="edit"
            :columns-element="columnsElement"
        >
        </DataGridCell>
        <span v-if="!columns || !columns.length" class="message ww-typo-sub-text flex items-center">
            Please define a column
        </span>
        <DataGridActionCell
            v-if="isEditAvailable"
            :id="id"
            :edit-button="editButton"
            :valid-edit-button="validEditButton"
            :cancel-button="cancelButton"
            :delete-button="deleteButton"
            :edit="edit"
            @update:edit="$emit('update:edit', $event)"
            @validate="onValidate"
            @delete="onDelete"
            @button-selected="onButtonSelected"
        ></DataGridActionCell>
    </tr>
</template>

<script>
import DataGridActionCell from './DataGridActionCell.vue';
import DataGridCell from './DataGridCell.vue';

export default {
    components: { DataGridActionCell, DataGridCell },
    props: {
        id: { type: undefined, required: true },
        item: { type: Object, required: true },
        columns: { type: Array, required: true },
        columnsElement: { type: Object, required: true },
        isEditAvailable: { type: Boolean, default: false },
        editButton: { type: Object, required: true },
        validEditButton: { type: Object, required: true },
        cancelButton: { type: Object, required: true },
        deleteButton: { type: Object, required: true },
        edit: { type: Boolean, default: false },
    },
    emits: ['update:edit', 'update:row', 'delete:row', 'button-selected'],
    data() {
        return {
            cellRefs: {},
        };
    },
    methods: {
        onValidate() {
            const item = _.cloneDeep(this.item);
            Object.values(this.cellRefs).forEach(row => {
                if (row.column && row.column.type !== 'custom') {
                    _.set(item, row.column && row.column.path, _.cloneDeep(row.internalValue));
                }
            });
            this.$emit('update:row', { value: item, id: this.id });
            this.$emit('update:edit', false);
        },
        onDelete() {
            this.$emit('delete:row', { id: this.id, value: this.item });
        },
        // TODO: we need higher vue version to have auto ref array
        registerCellRef(id, el) {
            if (el) {
                this.cellRefs[id] = el;
            }
        },
        onButtonSelected(key) {
            this.$emit('button-selected', { key, id: this.id });
        },
    },
};
</script>

<style lang="scss" scoped>
/* wwEditor:start */
.message {
    padding: var(--ww-spacing-02);
    color: var(--ww-color-theme-dark-800);
    background-color: var(--ww-color-theme-dark-50);
    border: 1px solid var(--ww-color-theme-dark-100);
}
/* wwEditor:end */
</style>
