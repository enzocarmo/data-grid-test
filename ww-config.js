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
                            type: {
                                label: { en: 'Type' },
                                type: 'TextSelect',
                                options: {
                                    options: [
                                        { value: 'text', label: 'Text' },
                                        { value: 'select', label: 'Select' },
                                        { value: 'custom', label: 'Custom' },
                                    ],
                                },
                            },
                            path: {
                                label: { en: 'Path' },
                                type: 'ObjectPropertyPath',
                                options: content => ({
                                    object: getDataObject(content),
                                }),
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
                expandable: true,
                getItemLabel(_, index) {
                    return `Column ${index + 1}`;
                },
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
            hidden: content => !content.inlineEditing,
        },
        editContainer: {
            navigator: {
                group: 'Edit Buttons',
                hidden: content => !content.inlineEditing,
            },
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
                        },
                        {
                            isWwObject: true,
                            type: 'ww-button',
                            content: { text: { en: 'Delete' } },
                        },
                    ],
                },
            },
        },
        editingContainer: {
            navigator: {
                group: 'Edit Buttons',
                hidden: content => !content.inlineEditing,
            },
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
                        },
                        {
                            isWwObject: true,
                            type: 'ww-button',
                            content: { text: { en: 'Validate' } },
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
                hidden: content => !content.displayHeader || !content.selectable,
            },
            defaultValue: { isWwObject: true, type: 'ww-text', state: { name: 'Header - Selection' } },
        },
        headerTextElements: {
            hidden: true,
            defaultValue: {},
            navigator: {
                group: 'Headers',
                hidden: content => !content.displayHeader,
            },
        },
        headerTextActions: {
            hidden: true,
            navigator: {
                group: 'Headers',
                hidden: content => !content.displayHeader || !content.inlineEditing,
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
        headerBackgroundColor: {
            label: {
                en: 'Header Background color',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
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
        hasStickyHeader: {
            label: {
                en: 'Sticky Header?',
            },
            type: 'OnOff',
            defaultValue: false,
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
            navigator: {
                hidden: content => !content.displayHeader || !content.selectable,
            },
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
