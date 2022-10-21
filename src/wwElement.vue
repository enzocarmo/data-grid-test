<template>
    <table class="ww-data-grid" :style="cssVars" :class="{ sticky: content.hasStickyHeader }">
        <colgroup>
            <col v-if="content.selectable" :style="{ width: content.selectColumnWidth || 'auto' }" />
            <template v-for="(column, index) in content.columns" :key="index">
                <col v-if="column.display" :style="{ width: column.width || 'auto' }" />
            </template>
            <col v-if="content.inlineEditing" :style="{ width: content.actionColumnWidth || 'auto' }" />
        </colgroup>
        <thead v-if="content.displayHeader">
            <th v-if="content.selectable">
                <div class="columnHeader">
                    <wwElement v-bind="content.headerTextSelectable" />
                    <wwElement
                        v-bind="content.selectCheckbox"
                        :states="isAllSelected ? ['checked'] : []"
                        @click="toggleAllSelection"
                    ></wwElement>
                </div>
            </th>
            <template v-for="(column, index) in content.columns" :key="index">
                <th v-if="column.display">
                    <div class="columnHeader">
                        <wwElement
                            v-if="content.headerTextElements[column.id]"
                            :uid="content.headerTextElements[column.id].uid"
                        ></wwElement>
                        <wwElement
                            v-if="content.sortIcon && column.sortable"
                            :uid="content.sortIcon.uid"
                            :class="{
                                '-reversed':
                                    columnsSort.order === 'DESC' && columnsSort.name === (column.name || index),
                            }"
                            :states="columnsSort.name === (column.name || index) ? ['active'] : ''"
                            @click="toggleSort(column, index)"
                        ></wwElement>
                    </div>
                </th>
            </template>
            <th v-if="content.inlineEditing" :style="{ width: content.actionColumnWidth || 'auto' }">
                <wwElement v-bind="content.headerTextActions" />
            </th>
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
                    :editable-custom-columns-element="content.editableCustomColumnsElement"
                    :is-edit-available="content.inlineEditing"
                    :edit="
                        (forcedInlineEditing && rowIndex === 0) ||
                        (content.inlineEditing && editingId !== undefined && getRowId(item) === editingId)
                    "
                    :edit-container="content.editContainer"
                    :editing-container="content.editingContainer"
                    :select-checkbox="content.selectCheckbox"
                    :selectable="content.selectable"
                    :is-selected="getIsSelected(getRowId(item))"
                    @update:edit="setEdit($event, getRowId(item))"
                    @update:row="$emit('trigger-event', { name: 'update:row', event: $event })"
                    @delete:row="$emit('trigger-event', { name: 'delete:row', event: $event })"
                    @update:is-selected="updateRowSelection($event, item, getRowId(item))"
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
            readonly: true,
            resettable: true,
        });
        const { value: columnsSort, setValue: setColumnsSort } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'sort',
            defaultValue: { name: null, order: 'ASC' },
            type: 'Object',
        });

        return { selectedRows, setSelectedRows, columnsSort, setColumnsSort };
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
                '--headerBgColor': this.content.headerBackgroundColor,
                '--rowBgColor': this.content.rowBackgroundColor,
                '--rowBgColorAlt': this.content.alternateBackground
                    ? this.content.rowBackgroundColorAlt
                    : this.content.rowBackgroundColor,
                ...(this.content.rowBackgroundColorHover
                    ? { '--rowBgColorHover': this.content.rowBackgroundColorHover }
                    : {}),
                ...(this.content.rowBackgroundColorSelected
                    ? { '--rowBgColorSelected': this.content.rowBackgroundColorSelected }
                    : {}),
                '--verticalAlignement': this.content.verticalAlignement,
                '--theadBordersVertical': this.content.isTheadBorderSplit
                    ? this.content.theadBordersVertical
                    : this.content.theadBorders,
                '--theadBordersHorizontal': this.content.isTheadBorderSplit
                    ? this.content.theadBordersHorizontal
                    : this.content.theadBorders,
                '--thBordersVertical': this.content.isThBorderSplit
                    ? this.content.thBordersVertical
                    : this.content.thBorders,
                '--thBordersHorizontal': this.content.isThBorderSplit
                    ? this.content.thBordersHorizontal
                    : this.content.thBorders,
                '--trBordersVertical': this.content.isTrBorderSplit
                    ? this.content.trBordersVertical
                    : this.content.trBorders,
                '--trBordersHorizontal': this.content.isTrBorderSplit
                    ? this.content.trBordersHorizontal
                    : this.content.trBorders,
                '--tdBordersVertical': this.content.isTdBorderSplit
                    ? this.content.tdBordersVertical
                    : this.content.tdBorders,
                '--tdBordersHorizontal': this.content.isTdBorderSplit
                    ? this.content.tdBordersHorizontal
                    : this.content.tdBorders,
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
        isAllSelected() {
            const data = wwLib.wwCollection.getCollectionData(this.content.data);
            if (!Array.isArray(data)) {
                return false;
            }
            return data.every((item, index) => this.selectedRows.some(({ id }) => id === this.getRowId(item, index)));
        },
    },
    watch: {
        /* wwEditor:start */
        'content.columns': {
            deep: true,
            handler(columns) {
                if (!Array.isArray(columns)) return;
                if (this.wwEditorState.isACopy) return;
                columns.forEach(async ({ type, id, editable, editableType }) => {
                    // Create column elements
                    const uid = this.content.columnsElement[id] && this.content.columnsElement[id].uid;
                    const { wwObjectBaseId: currentType } = uid ? wwLib.wwObjectHelper.getWwObject(uid) || {} : {};
                    if (!uid || currentType !== TYPE_OF_ELEMENTS[type]) {
                        const element = await wwLib.createElement(
                            TYPE_OF_ELEMENTS[type],
                            {},
                            { name: `Cell - ${type}` },
                            this.wwFrontState.sectionId
                        );
                        this.$emit('update:content:effect', {
                            columnsElement: {
                                ...this.content.columnsElement,
                                [id]: element,
                            },
                        });
                    }

                    // Create editable custom column elements
                    if (type === 'custom' && editable && editableType) {
                        const editableUid =
                            this.content.editableCustomColumnsElement[id] &&
                            this.content.editableCustomColumnsElement[id].uid;
                        const { wwObjectBaseId: currentEditableType } = editableUid
                            ? wwLib.wwObjectHelper.getWwObject(editableUid) || {}
                            : {};
                        if (!editableUid || currentEditableType !== TYPE_OF_ELEMENTS[editableType]) {
                            const element = await wwLib.createElement(
                                TYPE_OF_ELEMENTS[editableType],
                                {},
                                { name: `Editable Cell - ${type}` },
                                this.wwFrontState.sectionId
                            );
                            this.$emit('update:content:effect', {
                                editableCustomColumnsElement: {
                                    ...this.content.editableCustomColumnsElement,
                                    [id]: element,
                                },
                            });
                        }
                        // Delete editable custom column elements
                    } else if (this.content.editableCustomColumnsElement[id]) {
                        const editableCustomColumnsElement = { ...this.content.editableCustomColumnsElement };
                        delete editableCustomColumnsElement[id];
                        this.$emit('update:content:effect', { editableCustomColumnsElement });
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
            columns.push({ id, type: 'text', display: true, editable: true });
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
            const [col] = columns.splice(index, 1);
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
            if (this.content.editableCustomColumnsElement[col.id]) {
                const editableCustomColumnsElement = { ...this.content.editableCustomColumnsElement };
                delete editableCustomColumnsElement[col.id];
                update.editableCustomColumnsElement = editableCustomColumnsElement;
            }
            this.$emit('update:content', update);
        },
        /* wwEditor:end */
        setEdit(value, id) {
            this.editingId = value ? id : undefined;
        },
        getIsSelected(rowId) {
            if (!rowId) return false;
            if (!Array.isArray(this.selectedRows)) return false;
            return this.selectedRows.some(item => item && item.id === rowId);
        },
        updateRowSelection(value, item) {
            /* wwEditor:start */
            if (this.isEditing) return;
            /* wwEditor:end */
            const id = this.getRowId(item);
            if (!id) return;
            const isSelected = this.getIsSelected(id);
            if (value && !isSelected) {
                this.setSelectedRows([...this.selectedRows, { id, value: item }]);
            } else if (!value && isSelected) {
                this.setSelectedRows([...this.selectedRows].filter(selected => selected && selected.id !== id));
            }
        },
        /* wwEditor:start */
        getTestEvent() {
            if (!this.content.data.length) throw new Error('No data found');
            return {
                id: _.get(this.content.data[0], this.content.dataIdPath) || 0,
                value: this.content.data[0],
            };
        },
        /* wwEditor:end */
        async toggleSort(column, index) {
            if (!column.sortable) return;
            const colName = column.name || index;
            const order = colName === this.columnsSort.name && this.columnsSort.order === 'ASC' ? 'DESC' : 'ASC';
            await this.setColumnsSort({
                name: colName,
                order,
            });
            if (column.sortable === 'dynamic') {
                this.$emit('trigger-event', { name: 'sort', event: { order, name: colName } });
            }
        },
        toggleAllSelection() {
            const data = wwLib.wwCollection.getCollectionData(this.content.data);
            if (!Array.isArray(data)) {
                this.setSelectedRows([]);
                return;
            }
            if (this.isAllSelected) {
                this.setSelectedRows([]);
            } else {
                this.setSelectedRows(
                    data.map(value => ({
                        value,
                        id: this.getRowId(value),
                    }))
                );
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
    border-spacing: 0;
    position: relative;
    tr,
    th {
        padding: 0;
    }

    &.sticky {
        isolation: isolate;
        th {
            position: sticky;
            top: 0;
            z-index: 1;
        }
    }
    thead,
    th {
        background-color: var(--headerBgColor);
    }

    thead {
        border-left: var(--theadBordersVertical);
        border-right: var(--theadBordersVertical);
        border-top: var(--theadBordersHorizontal);
        border-bottom: var(--theadBordersHorizontal);
    }
    th {
        border-left: var(--thBordersVertical);
        border-right: var(--thBordersVertical);
        border-top: var(--thBordersHorizontal);
        border-bottom: var(--thBordersHorizontal);
    }
    tr {
        border-left: var(--trBordersVertical);
        border-right: var(--trBordersVertical);
        border-top: var(--trBordersHorizontal);
        border-bottom: var(--trBordersHorizontal);

        > :deep(td) {
            border-left: var(--tdBordersVertical);
            border-right: var(--tdBordersVertical);
            border-top: var(--tdBordersHorizontal);
            border-bottom: var(--tdBordersHorizontal);
        }
    }

    .body {
        display: table-row-group;
        .grid-row:nth-child(2n + 1) {
            background-color: var(--rowBgColor);
            transition: background-color 0.3s ease;
            &:hover {
                background-color: var(--rowBgColorHover, var(--rowBgColor));
            }
        }
        .grid-row:nth-child(2n) {
            background-color: var(--rowBgColorAlt);
            &:hover {
                background-color: var(--rowBgColorHover, var(--rowBgColorAlt));
            }
        }
        .bgSelected {
            background-color: var(--rowBgColorSelected) !important;
        }
        tr {
            vertical-align: var(--verticalAlignement);
        }
    }

    :deep(.-reversed) {
        transform: rotate(180deg);
        transition: transform 300ms ease-in-out;
    }
    .columnHeader {
        display: flex;
        align-items: center;
    }
}
</style>
