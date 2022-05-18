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
        editButton: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-button', content: { text: { en: 'Edit' } } },
            navigator: {
                group: 'Edit Buttons',
            },
        },
        deleteButton: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-button', content: { text: { en: 'Delete' } } },
            navigator: {
                group: 'Edit Buttons',
            },
        },
        cancelButton: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-button', content: { text: { en: 'Cancel' } } },
            navigator: {
                group: 'Edit Buttons',
            },
        },
        validEditButton: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-button', content: { text: { en: 'Validate' } } },
            navigator: {
                group: 'Edit Buttons',
            },
        },
        columnsElement: {
            hidden: true,
            defaultValue: {},
            navigator: {
                group: 'Cells',
            },
        },
        headerTextElements: {
            hidden: true,
            defaultValue: {},
            navigator: {
                group: 'Headers',
            },
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
        rowBackgroundColorHoverAlt: {
            label: {
                en: 'Row Background color (hover-alt)',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
            hidden: content => !content.alternateBackground,
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
    },
};
