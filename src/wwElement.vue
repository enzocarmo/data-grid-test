<template>
    <table class="ww-data-grid">
        <thead>
            <th v-for="(column, index) in content.columns" :key="index" :style="{ width: column.width || 'auto' }">
                <wwElement
                    v-if="content.headerTextElements[column.id]"
                    :uid="content.headerTextElements[column.id].uid"
                ></wwElement>
            </th>
            <th v-if="content.inlineEditing" :style="{ width: content.actionColumnWidth || 'auto' }"></th>
        </thead>
        <!-- // TODO: add if forced editing  -->
        <wwLayout path="data" tag="tbody" class="body" disable-edit>
            <template #default="{ index: rowIndex, data: item }">
                <DataGridRow
                    :id="getRowId(item)"
                    :key="getRowId(item, rowIndex)"
                    :item="item"
                    :columns="content.columns"
                    :columns-element="content.columnsElement"
                    :is-edit-available="content.inlineEditing"
                    :edit="editingId !== undefined && getRowId(item) === editingId"
                    :edit-button="content.editButton"
                    :valid-edit-button="content.validEditButton"
                    :cancel-button="content.cancelButton"
                    @update:edit="setEdit($event, getRowId(item))"
                    @update:row="$emit('trigger-event', { name: 'update:row', event: $event })"
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
        wwFrontState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['update:content', 'update:content:effect', 'trigger-event'],
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
    },
    watch: {
        'content.columns': {
            deep: true,
            handler(columns) {
                if (!Array.isArray(columns)) return;
                columns.forEach(async ({ type, id }) => {
                    // TODO: IDEA: if element of this type already exist, clone it?
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
    },
    methods: {
        getRowId(item, rowIndex) {
            return _.get(item, this.content.dataIdPath, rowIndex);
        },
        async addColumn() {
            const columns = [...this.content.columns];
            const id = wwLib.wwUtils.getUid();
            columns.push({ id });
            const headerTextElements = { ...this.content.headerTextElements };
            headerTextElements[id] = await wwLib.createElement(
                'ww-text',
                {},
                { name: `Header ${columns.length + 1}` },
                this.wwFrontState.sectionId
            );
            this.$emit('update:content', { columns, headerTextElements });
        },
        removeColumn({ index }) {
            const columns = [...this.content.columns];
            const col = columns.splice(index, 1);
            let update = { columns };
            if (this.content.columnsElementRead[col.id]) {
                const columnsElementRead = { ...this.content.columnsElementRead };
                delete columnsElementRead[col.id];
                update.columnsElementRead = columnsElementRead;
            }
            if (this.content.columnsElementWrite[col.id]) {
                const columnsElementWrite = { ...this.content.columnsElementWrite };
                delete columnsElementWrite[col.id];
                update.columnsElementWrite = columnsElementWrite;
            }
            if (this.content.headerTextElements[col.id]) {
                const headerTextElements = { ...this.content.headerTextElements };
                delete headerTextElements[col.id];
                update.headerTextElements = headerTextElements;
            }
            this.$emit('update:content', update);
        },
        setEdit(value, id) {
            /* wwEditor:start */
            if (this.isEditing) return;
            /* wwEditor:end */
            this.editingId = value ? id : undefined;
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
    }
}
</style>
