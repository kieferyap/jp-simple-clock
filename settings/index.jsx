const dateFormatOptions = [
  { name: '令 Y年 MM月 DD日 (曜)' },
  { name: 'YYYY年 MM月 DD日 (曜)' },
  { name: 'YYYY-MM-DD (dd)' },
  { name: 'MM-DD-YYYY (dd)' },
  { name: 'MM-DD (dd)' },
]

const timeFormatOptions = [
  { name: 'HH:MM ss' },
  { name: 'HH:MM' }
]

function clockSettings(props) {
  return (
    <Page>
      <Section title="Date Format">
        <Select
          label={`Select format`}
          settingsKey="dateFormat"
          options={dateFormatOptions}
          />
      </Section>
      <Section title="Time Format">
        <Select
          label={`Select format`}
          settingsKey="timeFormat"
          options={timeFormatOptions}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(clockSettings);