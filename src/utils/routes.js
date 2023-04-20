const flowRoutes = {
  flows: "/flows",
  createFlow: "/flows/create",
  flow: (flow) => `/flows/${flow}`,
  editFlow: (flow) => `/flows/${flow}/edit`,
  previewFlow: (flow) => `/flows/${flow}/preview`,
};

const settings = {
  settings: "/settings",
  settingsConfiguration: "/settings/configuration",
  settingsConfigurationCompany: "/settings/company",
  settingsDomains: "/settings/domains",
  settingsPlan: "/settings/my-plan",
  settingsHelp: "/settings/help",
  settingsIntegration: "/settings/integration",
  settingsIntegrationDetail: (id) => `/settings/integration/${id}`,
  settingsScript: "/settings/script",
};

const automations = {
  automations: "/automations",
  automationsDetail: (id) => `/automations/${id}/`,
};

const users = {
  users: "/users",
  userDetail: (id) => `/users/${id}`,
  segments: "/users/segments",
  segmentDetail: (segmentId) => `/users/segments/${segmentId}`,
};

const manage = {
  tags: "/manage/tags",
  fields: "/manage/fields",
};

const emails = {
  emails: "/emails",
};

const surveys = {
  surveys: "/surveys",
  createSurvey: "/surveys/create",
  surveyDetail: (id) => `/surveys/${id}`,
};

const routes = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  home: "/",
  stats: "/",
  ...automations,
  ...flowRoutes,
  ...settings,
  ...users,
  ...manage,
  ...emails,
  ...surveys,
};

export default routes;
