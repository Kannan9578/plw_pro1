export class ENV{
    public static readonly BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
    public static readonly USERNAME = process.env.USERNAME || 'Admin';
    public static readonly PASSWORD = process.env.PASSWORD || 'admin123';
    public static readonly DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
    public static readonly INVALID_USERNAME = process.env.INVALID_USERNAME || 'Admin123';
    public static readonly INVALID_PASSWORD = process.env.INVALID_PASSWORD || 'admin1234';
}