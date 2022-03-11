export default [
  {
    list: [
      {
        ft_label: '文本框',
        description: '',
        name: '',
        title: '',
        ft_values: [''],
        control: {
          type: 'TextControl',
          hint: '',
          maxLength: undefined,
          configurationForRequester: {
            editable: true,
            required: false,
          },
          configurationForResponder: {
            editable: true,
            required: false,
          },
        },
      },
      {
        ft_label: '只读文本框',
        description: '',
        name: '',
        title: '',
        ft_values: [''],
        control: {
          type: 'TextControl',
          hint: '',
          maxLength: undefined,
          configurationForRequester: {
            editable: false,
            required: false,
          },
          configurationForResponder: {
            editable: false,
            required: false,
          },
        },
      },
    ],
  },
  {
    list: [
      {
        ft_label: '数字框',
        ft_values: [undefined],
        description: '',
        name: '',
        title: '',
        control: {
          type: 'NumericControl',
          hint: '',
          maxValue: undefined,
          minValue: undefined,
          configurationForRequester: {
            editable: false,
            required: false,
          },
          configurationForResponder: {
            editable: false,
            required: false,
          },
        },
      },
    ],
  },
  {
    list: [
      {
        ft_label: '密码框',
        ft_values: [''],
        description: '',
        name: '',
        title: '',
        control: {
          type: 'PasswordControl',
          hint: '',
          maxLength: undefined,
          configurationForRequester: {
            editable: false,
            required: false,
          },
          configurationForResponder: {
            editable: false,
            required: false,
          },
        },
      },
    ],
  },
  {
    list: [
      {
        ft_label: '单选按钮框',
        ft_values: [''],
        description: '',
        name: '',
        title: '',
        control: {
          type: 'SingleSelectControl',
          hint: '',
          options: ['选项1'],
          configurationForRequester: {
            editable: false,
            required: false,
          },
          configurationForResponder: {
            editable: false,
            required: false,
          },
        },
      },
      {
        ft_label: '单选下拉框',
        ft_values: [''],
        description: '',
        name: '',
        title: '',
        control: {
          type: 'DropDownSingleSelectControl',
          hint: '',
          options: ['选项1'],
          configurationForRequester: {
            editable: false,
            required: false,
          },
          configurationForResponder: {
            editable: false,
            required: false,
          },
        },
      },
    ],
  },
  {
    list: [
      {
        ft_label: '复选按钮框',
        ft_values: [[]],
        description: '',
        name: '',
        title: '',
        control: {
          type: 'MultiSelectControl',
          hint: '',
          options: ['选项1'],
          configurationForRequester: {
            editable: false,
            required: false,
          },
          configurationForResponder: {
            editable: false,
            required: false,
          },
        },
      },
      {
        ft_label: '复选下拉框',
        ft_values: [[]],
        description: '',
        name: '',
        title: '',
        control: {
          type: 'DropDownMultiSelectControl',
          hint: '',
          options: ['选项1'],
          configurationForRequester: {
            editable: false,
            required: false,
          },
          configurationForResponder: {
            editable: false,
            required: false,
          },
        },
      },
    ],
  },
  {
    list: [
      {
        ft_label: '图片',
        ft_values: [[]],
        description: '',
        name: '',
        title: '',
        control: {
          type: 'ImageControl',
          hint: '',
          ft_values: [],
          minImage: 1,
          maxImage: 1,
          configurationForRequester: {
            editable: true,
            required: false,
          },
          configurationForResponder: {
            editable: true,
            required: false,
          },
        },
      },
      {
        ft_label: '只读图片',
        ft_values: [[]],
        description: '',
        name: '',
        title: '',
        control: {
          type: 'ImageControl',
          hint: '',
          ft_values: [],
          minImage: 1,
          maxImage: 1,
          configurationForRequester: {
            editable: false,
            required: false,
          },
          configurationForResponder: {
            editable: false,
            required: false,
          },
        },
      },
    ],
  },
]
