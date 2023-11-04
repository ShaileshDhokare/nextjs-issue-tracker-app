'use client';

import { Select } from '@radix-ui/themes';

const AssigneeSelect = () => {
  return (
    <Select.Root>
      <Select.Trigger placeholder='Assign...' />
      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          <Select.Item value='orange'>Orange</Select.Item>
          <Select.Item value='apple'>Apple</Select.Item>
          <Select.Item value='grape' disabled>
            Grape
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default AssigneeSelect;
