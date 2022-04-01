function getDataObject(content) {
    if (!content.data || !Array.isArray(content.data)) {
        return [];
    }
    return content.data[0] || {};
}
function hasData(content) {
    return Array.isArray(content.data) && content.data.length;
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
                                        { value: 'checkbox', label: 'Checkbox' },
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
        editButton: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-button', content: { text: { en: 'Edit' } } },
        },
        cancelButton: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-button', content: { text: { en: 'Cancel' } } },
        },
        validEditButton: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-button', content: { text: { en: 'Validate' } } },
        },
        columnsElementRead: {
            hidden: true,
            defaultValue: {},
        },
        columnsElementWrite: {
            hidden: true,
            defaultValue: {},
        },
        headerTextElements: {
            hidden: true,
            defaultValue: {},
        },
    },
};
