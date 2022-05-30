function getDataObject(content) {
    if (!content.data) return {};
    if (Array.isArray(content.data)) {
        return content.data[0] || {};
    }
    if (Array.isArray(content.data.data)) {
        return content.data.data[0] || {};
    }
    return {};
}
function hasData(content) {
    if (!content.data) return false;
    if (Array.isArray(content.data)) {
        return content.data.length;
    }
    if (Array.isArray(content.data.data)) {
        return content.data.data.length;
    }
    return false;
}

export default {
    editor: {
        label: {
            en: 'DataGrid',
        },
        icon: 'data-grid',
        bubble: {
            icon: 'data-grid',
        },
    },
    triggerEvents: [
        { name: 'update:row', label: { en: 'On Row update' }, event: { value: '', id: '' } },
        { name: 'delete:row', label: { en: 'On Row delete' }, event: { value: '', id: '' } },
    ],
    properties: {
        data: {
            label: {
                en: 'Grid data',
            },
            type: 'Info',
            options: {
                text: { en: 'Bind your data' },
            },
            bindable: true,
            defaultValue: [],
        },
        warning: {
            type: 'Info',
            editorOnly: true,
            options: {
                text: { en: 'Please bind your data to an array to configure your data-grid' },
            },
            hidden: content => hasData(content),
        },
        dataIdPath: {
            label: {
                en: 'Id field',
            },
            type: 'ObjectPropertyPath',
            options: content => ({
                object: getDataObject(content),
            }),
            hidden: content => !hasData(content),
        },
        columns: {
            label: {
                en: 'Columns',
            },
            type: 'Array',
            hidden: content => !hasData(content),
            options: {
                item: {
                    type: 'Object',
                    options: {
                        item: {
                            path: {
                                label: { en: 'Path' },
                                type: 'ObjectPropertyPath',
                                options: content => ({
                                    object: getDataObject(content),
                                }),
                            },
                            type: {
                                label: { en: 'Type' },
                                type: 'TextSelect',
                                options: {
                                    options: [
                                        { value: 'text', label: 'Text' },
                                        { value: 'select', label: 'Select' },
                                        // { value: 'checkbox', label: 'Checkbox' },
                                        { value: 'custom', label: 'Custom' },
                                    ],
                                },
                            },
                            width: {
                                label: { en: 'Width' },
                                type: 'Length',
                            },
                            display: {
                                label: { en: 'Display' },
                                type: 'OnOff',
                                bindable: true,
                                defaultValue: true,
                            },
                            editable: {
                                label: { en: 'Editable' },
                                type: 'OnOff',
                                bindable: true,
                                defaultValue: true,
                                hidden: content => !content.inlineEditing,
                            },
                            id: {
                                hidden: true,
                            },
                        },
                    },
                    defaultValue: { label: 'Header' },
                },
                add: 'addColumn',
                remove: 'removeColumn',
                movable: true,
            },
            defaultValue: [],
        },
        inlineEditing: {
            label: {
                en: 'Inline editing',
            },
            type: 'OnOff',
            defaultValue: false,
        },
        actionColumnWidth: {
            label: 'Actions Width',
            type: 'Length',
            hidden: content => !content.inlineEditing,
        },
        forcedInlineEditing: {
            label: {
                en: 'Forced display edit',
            },
            type: 'OnOff',
            editorOnly: true,
            defaultValue: false,
        },
        editContainer: {
            group: 'Edit Buttons',
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-flexbox',
                content: {
                    children: [
                        {
                            isWwObject: true,
                            type: 'ww-button',
                            content: { text: { en: 'Edit' } },
                            state: { name: 'Edit button' },
                        },
                        {
                            isWwObject: true,
                            type: 'ww-button',
                            content: { text: { en: 'Delete' } },
                            state: { name: 'Delete button' },
                        },
                    ],
                },
            },
        },
        editingContainer: {
            group: 'Edit Buttons',
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-flexbox',
                content: {
                    children: [
                        {
                            isWwObject: true,
                            type: 'ww-button',
                            content: { text: { en: 'Cancel' } },
                            state: { name: 'Cancel button' },
                        },
                        {
                            isWwObject: true,
                            type: 'ww-button',
                            content: { text: { en: 'Validate' } },
                            state: { name: 'Validate button' },
                        },
                    ],
                },
            },
        },
        columnsElement: {
            hidden: true,
            defaultValue: {},
            navigator: {
                group: 'Cells',
            },
        },
        headerTextSelectable: {
            hidden: true,
            navigator: {
                group: 'Headers',
            },
            defaultValue: { isWwObject: true, type: 'ww-text', state: { name: 'Header - Selection' } },
        },
        headerTextElements: {
            hidden: true,
            defaultValue: {},
            navigator: {
                group: 'Headers',
            },
        },
        headerTextActions: {
            hidden: true,
            navigator: {
                group: 'Headers',
            },
            defaultValue: { isWwObject: true, type: 'ww-text', state: { name: 'Header - Actions' } },
        },
        displayHeader: {
            label: {
                en: 'Show Header',
            },
            type: 'OnOff',
            defaultValue: true,
            responsive: true,
        },
        alternateBackground: {
            label: {
                en: 'Alternate background?',
            },
            type: 'OnOff',
            defaultValue: false,
        },
        rowBackgroundColor: {
            label: {
                en: 'Row Background color',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
        },
        rowBackgroundColorAlt: {
            label: {
                en: 'Row Background color (alt)',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
            hidden: content => !content.alternateBackground,
        },
        rowBackgroundColorHover: {
            label: {
                en: 'Row Background color (hover)',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
        },
        selectable: {
            label: {
                en: 'Allow selection',
            },
            type: 'OnOff',
            defaultValue: false,
        },
        selectCheckbox: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-checkbox', state: { name: 'Select checkbox' } },
        },
        selectColumnWidth: {
            label: 'Select Width',
            type: 'Length',
            hidden: content => !content.selectable,
        },
        verticalAlignement: {
            label: { en: 'Vertical Alignement' },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'top', label: 'Top' },
                    { value: 'middle', label: 'Middle' },
                    { value: 'bottom', label: 'Bottom' },
                ],
            },
            default: 'top',
        },
    },
};
