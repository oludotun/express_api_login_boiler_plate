const baseMail = require('./base');
const { appName } = require('../../config/app');

module.exports = { 
    html: (user, password) => {
        const body_content =  `
            <!-- Email Body -->
            <tr>
                <td class="body" width="100%" cellpadding="0" cellspacing="0"
                        style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box;
                                background-color: #FFFFFF; border-bottom: 1px solid #EDEFF2;
                                border-top: 1px solid #EDEFF2; margin: 0; padding: 0; width: 100%;
                                -premailer-cellpadding: 0; -premailer-cellspacing: 0;
                                -premailer-width: 100%;">
                    <table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0"
                            style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box;
                                    background-color: #FFFFFF; margin: 0 auto; padding: 0; width: 570px;
                                    -premailer-cellpadding: 0; -premailer-cellspacing: 0;
                                    -premailer-width: 570px;">
                        <!-- Body content -->
                        <tr>
                            <td class="content-cell" style="font-family: Avenir, Helvetica, sans-serif;
                                    box-sizing: border-box; padding: 35px;">
                                <p style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box;
                                        color: #2F3133; font-size: 16px; line-height: 1.5em; margin-top: 0;
                                        text-align: left;">
                                    Dear ${user.name},
                                </p>
                                <p style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box;
                                        color: #74787E; font-size: 16px; line-height: 1.5em; margin-top: 0;
                                        text-align: left;">
                                    We have received a request to reset your password, please use the following
                                    password on your next login: ${password}
                                </p>
                                <p style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box;
                                        color: #74787E; font-size: 16px; line-height: 1.5em; margin-top: 0;
                                        text-align: left;">
                                    Also, do ensure to change your password to something you can easily remember.
                                </p>
                                <p style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box;
                                        color: #74787E; font-size: 16px; line-height: 1.5em; margin-top: 0;
                                        text-align: left;">
                                    Regards,<br>
                                    ${appName} Account Services
                                </p>                                        
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>`;
        return baseMail(body_content);
    },
    text: (user, password) => {
        return `
            Dear ${user.name},

            We have received a request to reset your password, please use the following
            password on your next login: ${password}

            Also, do ensure to change your password to something you can easily remember.

            Regards,
            ${appName} Account Services

            © ${new Date().getFullYear()} ${appName}. All rights reserved.`;
    }
};