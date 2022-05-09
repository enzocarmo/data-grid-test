<template>
    <table class="ww-data-grid" :style="cssVars">
        <thead v-if="content.displayHeader">
            <th v-if="selectable"></th>
            <th v-for="(column, index) in content.columns" :key="index" :style="{ width: column.width || 'auto' }">
                <wwElement
                    v-if="content.headerTextElements[column.id]"
                    :uid="content.headerTextElements[column.id].uid"
                ></wwElement>
            </th>
            <th v-if="content.inlineEditing" :style="{ width: content.actionColumnWidth || 'auto' }"></th>
        </thead>
        <wwLayout path="data" tag="tbody" class="body" disable-edit>
            <template #default="{ index: rowIndex, data: item }">
                <DataGridRow
                    :id="getRowId(item)"
                    :key="getRowId(item, rowIndex)"
                    class="grid-row"
                    :item="item"
                    :columns="content.columns"
                    :columns-element="content.columnsElement"
                    :is-edit-available="content.inlineEditing"
                    :edit="
                        (forcedInlineEditing && rowIndex === 0) ||
                        (content.inlineEditing && editingId !== undefined && getRowId(item) === editingId)
                    "
                    :edit-button="content.editButton"
                    :valid-edit-button="content.validEditButton"
                    :cancel-button="content.cancelButton"
                    :delete-button="content.deleteButton"
                    :select-checkbox="content.selectCheckbox"
                    :selectable="content.selectable"
                    :is-selected="getIsSelected(getRowId(item))"
                    @update:edit="setEdit($event, getRowId(item))"
                    @update:row="$emit('trigger-event', { name: 'update:row', event: $event })"
                    @delete:row="$emit('trigger-event', { name: 'delete:row', event: $event })"
                    @update:is-selected="updateRowSelection($event, item, getRowId(item))"
                    @button-selected="onButtonSelected"
                />
            </template>
        </wwLayout>
    </table>
</template>

<script>
import { TYPE_OF_ELEMENTS } from './constants';
import DataGridRow from './DataGridRow.vue';

export default {
    components: { DataGridRow },
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
        wwFrontState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['update:content', 'update:content:effect', 'trigger-event'],
    setup(props) {
        const { value: selectedRows, setValue: setSelectedRows } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'selectedRows',
            defaultValue: [],
            type: 'Array',
        });

        return { selectedRows, setSelectedRows };
    },
    data() {
        return {
            editingId: undefined,
        };
    },
    computed: {
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
        cssVars() {
            return {
                '--rowBgColor': this.content.rowBackgroundColor,
                '--rowBgColorAlt': this.content.alternateBackground
                    ? this.content.rowBackgroundColorAlt
                    : this.content.rowBackgroundColor,
            };
        },
        forcedInlineEditing() {
            /* wwEditor:start */
            return (
                this.isEditing &&
                this.wwEditorState.sidepanelContent &&
                this.wwEditorState.sidepanelContent.forcedInlineEditing
            );
            /* wwEditor:end */
            return false;
        },
    },
    watch: {
        /* wwEditor:start */
        'content.columns': {
            deep: true,
            handler(columns) {
                if (!Array.isArray(columns)) return;
                if (this.wwEditorState.isACopy) return;
                columns.forEach(async ({ type, id }) => {
                    if (
                        !this.content.columnsElement[id] ||
                        this.content.columnsElement[id].type !== TYPE_OF_ELEMENTS[type]
                    ) {
                        const element = await wwLib.createElement(
                            TYPE_OF_ELEMENTS[type],
                            {},
                            { name: `Cell - ${type}` },
                            this.wwFrontState.sectionId
                        );
                        this.$emit('update:content:effect', {
                            columnsElement: {
                                ...this.content.columnsElement,
                                [id]: { ...element, type: TYPE_OF_ELEMENTS[type] },
                            },
                        });
                    }
                });
            },
        },
        /* wwEditor:end */
    },
    methods: {
        getRowId(item, rowIndex) {
            return _.get(item, this.content.dataIdPath, rowIndex);
        },
        /* wwEditor:start */
        async addColumn() {
            const columns = [...this.content.columns];
            const id = wwLib.wwUtils.getUid();
            columns.push({ id });
            const headerTextElements = { ...this.content.headerTextElements };
            headerTextElements[id] = await wwLib.createElement(
                'ww-text',
                {},
                { name: `Header ${columns.length}` },
                this.wwFrontState.sectionId
            );
            this.$emit('update:content', { columns, headerTextElements });
        },
        removeColumn({ index }) {
            const columns = [...this.content.columns];
            const col = columns.splice(index, 1);
            let update = { columns };
            if (this.content.columnsElement[col.id]) {
                const columnsElement = { ...this.content.columnsElement };
                delete columnsElement[col.id];
                update.columnsElement = columnsElement;
            }
            if (this.content.headerTextElements[col.id]) {
                const headerTextElements = { ...this.content.headerTextElements };
                delete headerTextElements[col.id];
                update.headerTextElements = headerTextElements;
            }
            this.$emit('update:content', update);
        },
        /* wwEditor:end */
        setEdit(value, id) {
            /* wwEditor:start */
            if (this.isEditing) return;
            /* wwEditor:end */
            this.editingId = value ? id : undefined;
        },
        onButtonSelected({ key, id }) {
            // TODO: voir avec Flo
        },
        getIsSelected(rowId) {
            if (!rowId) return false;
            if (!Array.isArray(this.selectedRows)) return false;
            return this.selectedRows.some(item => item && item.id === rowId);
        },
        updateRowSelection(value, item) {
            const id = this.getRowId(item);
            if (!id) return;
            const isSelected = this.getIsSelected(id);
            if (value && !isSelected) {
                this.setSelectedRows([...this.selectedRows, { id, value: item }]);
            } else if (!value && isSelected) {
                this.setSelectedRows([...this.selectedRows].filter(selected => selected && selected.id !== id));
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-data-grid {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    .body {
        display: table-row-group;
        .grid-row:nth-child(2n) {
            background-color: var(--rowBgColor);
        }
        .grid-row:nth-child(2n + 1) {
            background-color: var(--rowBgColorAlt);
        }
    }
}
</style>
