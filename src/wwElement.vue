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
        <tbody>
            <!-- // TODO: add if forced editing  -->
            <DataGridRow
                v-for="(item, rowIndex) in content.data"
                :id="getRowId(item)"
                :key="getRowId(item, rowIndex)"
                :item="item"
                :columns="content.columns"
                :columns-element-read="content.columnsElementRead"
                :columns-element-write="content.columnsElementWrite"
                :is-edit-available="content.inlineEditing"
                :edit="editingId !== undefined && getRowId(item) === editingId"
                :edit-button="content.editButton"
                :valid-edit-button="content.validEditButton"
                :cancel-button="content.cancelButton"
                @update:edit="setEdit($event, getRowId(item))"
            />
        </tbody>
    </table>
</template>

<script>
import { TYPE_OF_ELEMENTS_READ, TYPE_OF_ELEMENTS_WRITE } from './constants';
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
    emits: ['update:content', 'update:content:effect'],
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
                columns.forEach(async ({ type, id, label }) => {
                    const readType = TYPE_OF_ELEMENTS_READ[type];
                    const writeType = TYPE_OF_ELEMENTS_WRITE[type];
                    if (!this.content.columnsElementRead[id] || this.content.columnsElementRead[id].type !== readType) {
                        const element = await wwLib.createElement(
                            readType,
                            {},
                            { name: `Cell - ${label}` },
                            this.wwFrontState.sectionId
                        );
                        this.$emit('update:content:effect', {
                            columnsElementRead: {
                                ...this.content.columnsElementRead,
                                [id]: { ...element, type: readType },
                            },
                        });
                    }
                    if (
                        !this.content.columnsElementWrite[id] ||
                        this.content.columnsElementWrite[id].type !== writeType
                    ) {
                        if (writeType) {
                            const element = await wwLib.createElement(
                                writeType,
                                {},
                                { name: `Cell (Read) - ${label}` },
                                this.wwFrontState.sectionId
                            );
                            this.$emit('update:content:effect', {
                                columnsElementWrite: {
                                    ...this.content.columnsElementWrite,
                                    [id]: { ...element, type: writeType },
                                },
                            });
                        } else if (this.content.columnsElementWrite[id]) {
                            const columnsElementWrite = { ...this.columnsElementWrite };
                            delete columnsElementWrite[id];
                            this.$emit('update:content:effect', { columnsElementWrite });
                        }
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
}
</style>
