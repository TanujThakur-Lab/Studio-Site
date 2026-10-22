// SAMPLE DATA. Every company, person, ticket and figure here is made up for the on-page demos.

/** Hero: messy notes that become the weekly report. `line` maps a note to a report line id; null notes are noise. */
export const heroNotes = [
  { text: '#4812 customs hold, docs resent 14:20', line: 'd1', x: 4, y: 8, r: -4 },
  { text: 'client asked ETA AGAIN (3rd time)', line: 'w1', x: 46, y: 4, r: 3 },
  { text: '#4815 invoice mismatch, fixed + closed', line: 'd2', x: 22, y: 30, r: 2 },
  { text: 'vessel delayed 2 days?? tell Sample Freight', line: 'w1', x: 58, y: 26, r: -3 },
  { text: 'lunch order', line: null, x: 2, y: 52, r: 5 },
  { text: '#4819 BL draft approved by client', line: 'd3', x: 36, y: 50, r: -2 },
  { text: 'still waiting: DO from shipping line', line: 'w2', x: 6, y: 66, r: -5 },
  { text: '#4821 reefer alarm, false, closed', line: 'd4', x: 52, y: 70, r: 4 },
  { text: 'remind them about KYC docs!!', line: 'w3', x: 30, y: 78, r: 2 },
  { text: 'printer jammed again', line: null, x: 64, y: 82, r: -2 },
  { text: 'Fri: send weekly update', line: null, x: 70, y: 48, r: 6 },
];

export const heroReport = {
  client: 'Sample Freight Ltd',
  week: 'Week 42',
  summary: '7 items this week: 4 done, 3 waiting on you or the line.',
  sections: [
    {
      title: 'Done',
      lines: [
        { id: 'd1', text: 'Customs hold cleared; documents re-sent on Tuesday.' },
        { id: 'd2', text: 'Invoice mismatch corrected and closed.' },
        { id: 'd3', text: 'Bill of lading draft approved.' },
        { id: 'd4', text: 'Reefer temperature alarm checked: false alarm.' },
      ],
    },
    {
      title: 'Waiting',
      lines: [
        { id: 'w1', text: 'Vessel running two days late; new ETA confirmed Monday.' },
        { id: 'w2', text: 'Delivery order still due from the shipping line.' },
        { id: 'w3', text: 'Your KYC documents, please, by Wednesday.' },
      ],
    },
  ],
};

/** What we build: weekly status report demo. Counts add up per week. */
export const reportWeeks = [
  {
    week: 'Week 41', client: 'Example IT Services', opened: 14, closed: 12,
    items: ['Email migration finished for 12 mailboxes.', 'Two laptops replaced under warranty.', 'Backup test passed on Thursday.'],
    waiting: ['Firewall change needs your sign-off.', 'New starter details for Monday.'],
  },
  {
    week: 'Week 42', client: 'Example IT Services', opened: 9, closed: 11,
    items: ['Printer queue fixed on the second floor.', 'VPN access set up for 3 remote staff.', 'Licence renewals logged for November.'],
    waiting: ['Approval for the new Wi-Fi access point.'],
  },
  {
    week: 'Week 43', client: 'Example IT Services', opened: 17, closed: 13,
    items: ['Phishing email reported and blocked.', 'Shared drive permissions tidied.', 'Accounts laptop rebuilt.'],
    waiting: ['Budget call for server replacement.', 'Leaver accounts to disable.', 'Supplier invoice query.'],
  },
];

/** Client reminders demo. */
export const reminderClients = [
  { id: 'a', name: 'Sample Freight Ltd', contact: 'Priya', item: 'signed KYC documents', due: '23 October', days: 2 },
  { id: 'b', name: 'Demo Exports Pvt Ltd', contact: 'Arjun', item: 'commercial invoice for shipment SX-2291', due: '25 October', days: 4 },
  { id: 'c', name: 'Example Consulting LLP', contact: 'Meera', item: 'feedback on the draft proposal', due: '28 October', days: 7 },
];

/** Document update demo: a rate sheet before and after the March change. */
export const docRows = [
  { item: 'Ocean freight, 20ft, Nhava Sheva to Jebel Ali', before: '₹48,500', after: '₹52,000' },
  { item: 'Ocean freight, 40ft, Nhava Sheva to Jebel Ali', before: '₹86,000', after: '₹86,000' },
  { item: 'Documentation fee', before: '₹2,500', after: '₹3,000' },
  { item: 'Free days at destination', before: '7 days', after: '5 days' },
];

/** Dashboard demo: open tickets by weekday. */
export const dashboard = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  teams: {
    Freight: [6, 9, 5, 7, 4],
    'IT support': [3, 4, 8, 2, 5],
  },
  overdue: { Freight: 3, 'IT support': 2 },
  firstReplyMins: { Freight: 42, 'IT support': 18 },
};
