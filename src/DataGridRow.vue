<template>
    <tr>
        <DataGridCell
            v-for="column in columns"
            :key="column.id"
            :column="column"
            :item="item"
            :edit="edit"
            :columns-element-read="columnsElementRead"
            :columns-element-write="columnsElementWrite"
        >
        </DataGridCell>
        <DataGridActionCell
            v-if="isEditAvailable"
            :id="id"
            :edit-button="editButton"
            :valid-edit-button="validEditButton"
            :cancel-button="cancelButton"
            :edit="edit"
            @update:edit="$emit('update:edit', $event)"
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
        columnsElementRead: { type: Object, required: true },
        columnsElementWrite: { type: Object, required: true },
        isEditAvailable: { type: Boolean, default: false },
        editButton: { type: Object, required: true },
        validEditButton: { type: Object, required: true },
        cancelButton: { type: Object, required: true },
        edit: { type: Boolean, default: false },
    },
    emits: ['update:edit'],
};
</script>
