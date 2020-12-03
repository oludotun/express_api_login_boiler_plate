const baseMail = require('./base');
const { appName } = require('../../config/app');

module.exports = { 
    html: (user, link) => {
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
                                    Thank you for choosing ${appName}!
                                </p>
                                <p style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box;
                                        color: #74787E; font-size: 16px; line-height: 1.5em; margin-top: 0;
                                        text-align: left;">
                                    You're almost done! Please click the link/button below within 48 hours to confirm 
                                    that <b>${user.email}</b> is your email address:
                                </p>
                                <table class="action" align="center" width="100%" cellpadding="0"
                                        cellspacing="0" style="font-family: Avenir, Helvetica, sans-serif;
                                        box-sizing: border-box; margin: 30px auto; padding: 0;
                                        text-align: center; width: 100%; -premailer-cellpadding: 0;
                                        -premailer-cellspacing: 0; -premailer-width: 100%;">
                                    <tr>
                                        <td align="center" style="font-family: Avenir, Helvetica, sans-serif;
                                                box-sizing: border-box;">
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                    style="font-family: Avenir, Helvetica, sans-serif;
                                                    box-sizing: border-box;">
                                                <tr>
                                                    <td align="center"
                                                            style="font-family: Avenir, Helvetica, sans-serif;
                                                            box-sizing: border-box;">
                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                                style="font-family: Avenir, Helvetica, sans-serif;
                                                                box-sizing: border-box;">
                                                            <tr>
                                                                <td style="font-family: Avenir, Helvetica, sans-serif;
                                                                        box-sizing: border-box;">
                                                                    <a href="${link}" class="button button-blue" target="_blank" style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box; border-radius: 3px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16); color: #FFF; display: inline-block; text-decoration: none; -webkit-text-size-adjust: none; background-color: #3097D1; border-top: 10px solid #3097D1; border-right: 18px solid #3097D1; border-bottom: 10px solid #3097D1; border-left: 18px solid #3097D1;">
                                                                        Confirm Email Address
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <p style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box;
                                        color: #74787E; font-size: 16px; line-height: 1.5em; margin-top: 0;
                                        text-align: left;">
                                    Regards,<br>
                                    ${appName} Onboarding Team
                                </p>
                                <table class="subcopy" width="100%" cellpadding="0" cellspacing="0"
                                        style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box;
                                        border-top: 1px solid #EDEFF2; margin-top: 25px; padding-top: 25px;">
                                    <tr>
                                        <td style="font-family: Avenir, Helvetica, sans-serif;
                                                box-sizing: border-box;">
                                            <p style="font-family: Avenir, Helvetica, sans-serif;
                                                    box-sizing: border-box; color: #74787E; line-height: 1.5em;
                                                    margin-top: 0; text-align: left; font-size: 12px;">
                                                If you’re having trouble clicking the "Confirm Email Address" button, copy and paste the URL below into your web browser:
                                                <a href="${link}"
                                                        style="font-family: Avenir, Helvetica, sans-serif;
                                                        box-sizing: border-box; color: #3869D4;">
                                                    ${link}
                                                </a>
                                            </p>
                                        </td>
                                    </tr>
                                </table>                                        
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>`;
        return baseMail(body_content);
    },
    text: (user, link) => {
        return `
            Dear ${user.name},

            Thank you for choosing ${appName}!

            You're almost done! Please click the link below within 48 hours to confirm

            that ${user.email} is your email address: Confirm Email Address: ${link}

            Regards,
            ${appName} Onboarding Team

            If you’re having trouble clicking the "Confirm Email Address" button, 
            copy and paste the URL below into your web browser: 
            [${link}](${link})

            © ${new Date().getFullYear()} ${appName}. All rights reserved.`;
    }
};