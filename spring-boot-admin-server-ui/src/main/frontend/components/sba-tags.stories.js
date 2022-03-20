import SbaTags from './sba-tags';

export default {
  component: SbaTags,
  title: 'SBA Components/Tags',
};

const Template = (args, {argTypes}) => ({
  components: {SbaTags},
  props: Object.keys(argTypes),
  template: '<sba-tags v-bind="$props" />'
});

export const SingleTag = Template.bind({});
SingleTag.args = {
  tags: {
    'This is a key': 'This a value',
  }
};

export const MultipleTags = Template.bind({});
MultipleTags.args = {
  tags: {
    'This is a key': 'This a value',
    simpleKey: 'value',
  }
};
