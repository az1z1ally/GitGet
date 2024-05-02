# GITHUB PAGES CONFIGURATION WITH CUSTOM DOMAIN + VERIFICATION

## About domain verification for GitHub Pages
When you verify a custom domain for your personal account, only repositories owned by your personal account may be used to publish a GitHub Pages site to the verified custom domain or the domain's immediate subdomains. Similarly, when you verify a custom domain for your organization, only repositories owned by that organization may be used to publish a GitHub Pages site to the verified custom domain or the domain's immediate subdomains.

Verifying your domain stops other GitHub users from taking over your custom domain and using it to publish their own GitHub Pages site. Domain takeovers can happen when you delete your repository, when your billing plan is downgraded, or after any other change which unlinks the custom domain or disables GitHub Pages while the domain remains configured for GitHub Pages and is not verified.

When you verify a domain, any immediate subdomains are also included in the verification. For example, if the github.com custom domain is verified, docs.github.com, support.github.com, and any other immediate subdomains will also be protected from takeovers.

## Verifying a domain that is already taken
If you are verifying a domain you own, which is currently in use by another user or organization, to make it available for your GitHub Pages website; note that the process to release the domain from its current location will take 7 days to complete. If you are attempting to verify an already verified domain (verified by another user or organization), the release process will not be successful.

~Warning:~ We strongly recommend that you do not use wildcard DNS records, such as *.example.com. These records put you at an immediate risk of domain takeovers, even if you verify the domain. For example, if you verify example.com this prevents someone from using a.example.com but they could still take over b.a.example.com (which is covered by the wildcard DNS record).


## Verifying a domain for your user site
1. In the upper-right corner of any page, click your profile photo, then click Settings.

2. In the "Code, planning, and automation" section of the sidebar, click  Pages.

3. On the right, click Add a domain.

4. Under "What domain would you like to add?," enter the domain you wish to verify and select Add domain.

Follow the instructions under "Add a DNS TXT record" to create the TXT record with your domain hosting service.

1. Create a TXT record in your DNS configuration for the following hostname: _github-pages-challenge-az1z1ally.githives.com
2. Use this code for the value of the TXT record: f9ce2bec537dd1a546809c3cc2f483
3. Wait for your DNS configuration to change, this may be immediate or take up to 24 hours.
  
You can confirm the change to your DNS configuration by running the dig command on the command line. In the command below, replace USERNAME with your username and example.com with the domain you're verifying. If your DNS configuration has updated, you should see your new TXT record in the output.

dig _github-pages-challenge-USERNAME.example.com +nostats +nocomments +nocmd TXT
After confirming that your DNS configuration has updated, you can verify the domain. If the change wasn't immediate, and you have navigated away from the previous page, return to your Pages settings by following the first few steps and, to the right of the domain, click  and then click Continue verifying.

To verify your domain, click Verify.

To make sure your custom domain remains verified, keep the TXT record in your domain's DNS configuration.

## Verifying a domain for your organization site
Organization owners can verify custom domains for their organization.

1. In the upper-right corner of GitHub.com, select your profile photo, then click  Your organizations.

2. Next to the organization, click Settings.

3. In the "Code, planning, and automation" section of the sidebar, click  Pages.

4. On the right, click Add a domain.

5. Under "What domain would you like to add?," enter the domain you wish to verify and select Add domain.

Follow the instructions under "Add a DNS TXT record" to create the TXT record with your domain hosting service.

Wait for your DNS configuration to change. This may be immediate or take up to 24 hours. You can confirm the change to your DNS configuration by running the dig command on the command line. In the command below, replace ORGANIZATION with the name of your organization and example.com with the domain you're verifying. If your DNS configuration has updated, you should see your new TXT record in the output.

dig _github-pages-challenge-ORGANIZATION.example.com +nostats +nocomments +nocmd TXT
After confirming that your DNS configuration has updated, you can verify the domain. If the change wasn't immediate, and you have navigated away from the previous page, return to your Pages settings by following the first few steps and, to the right of the domain, click  and then click Continue verifying.

Under the horizontal kebab icon to the right, the "Continue verifying" dropdown option is outlined in dark orange.
To verify your domain, click Verify.

To make sure your custom domain remains verified, keep the TXT record in your domain's DNS configuration.


# DNS CONFIGURATIONS
Certainly! Let’s walk through the steps to verify your custom domain githives.com for GitHub Pages and configure the necessary DNS records:

Verifying Your Custom Domain:
Verifying your domain is essential for security and to prevent domain takeovers. When you verify a domain, it ensures that only your repositories can publish a GitHub Pages site to that domain.
To verify your custom domain, follow these steps:
Go to your GitHub repository settings.
Under your repository name, click Settings.
In the Code and automation section of the sidebar, click Pages.
Under Custom domain, enter githives.com and click Save.
GitHub will create a commit adding a CNAME file directly to the root of your source branch (if publishing from a branch). If using a custom GitHub Actions workflow, no CNAME file is created.
Verifying your domain prevents others from taking over your custom domain for their GitHub Pages site.
Remember that DNS changes can take up to 24 hours to propagate.

## About custom domain configuration
 Make sure you add your custom domain to your GitHub Pages site before configuring your custom domain with your DNS provider. Configuring your custom domain with your DNS provider without adding your custom domain to GitHub could result in someone else being able to host a site on one of your subdomains.

1. Root apex (example.com)
2. Sub-domain (www.example.com)
3. HTTPS (optional but strongly encouraged)

In the end, all requests to example.com will be re-directed to https://www.example.com (or http:// if you choose NOT to use HTTPS)

## Configuring an apex domain
To set up an apex domain, such as example.com, you must configure a custom domain in your repository settings and at least one ALIAS, ANAME, or A record with your DNS provider

1. On GitHub, navigate to your site's repository.

2. Under your repository name, click  Settings. If you cannot see the "Settings" tab, select the  dropdown menu, then click Settings.

3. In the "Code and automation" section of the sidebar, click  Pages.

4. Under "Custom domain", type your custom domain, then click Save. If you are publishing your site from a branch, this will create a commit that adds a CNAME file directly to the root of your source branch. If you are publishing your site with a custom GitHub Actions workflow, no CNAME file is created. For more information about your publishing source, see "Configuring a publishing source for your GitHub Pages site."

Certainly! Now that you’ve already created the CNAME commit in your repository’s root folder, the next steps involve verifying your custom domain githives.com for GitHub Pages and configuring the necessary DNS records. Let’s break it down:

NB: Verifying your domain is crucial for security and to prevent domain takeovers. When you verify a domain, it ensures that only your repositories can publish a GitHub Pages site to that domain.

5. Navigate to your DNS provider and create either an ALIAS, ANAME, or A record. You can also create AAAA records for IPv6 support. If you're implementing IPv6 support, we highly recommend using an A record in addition to your AAAA record, due to slow adoption of IPv6 globally. For more information about how to create the correct record, see your DNS provider's documentation.

To create an ALIAS or ANAME record, point your apex domain to the default domain for your site. For more information about the default domain for your site, see "About GitHub Pages."

To create A records, point your apex domain to the IP addresses for GitHub Pages.
`185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153`

To create AAAA records, point your apex domain to the IP addresses for GitHub Pages.

`2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153`


6. Open Git Bash.

7. To confirm that your DNS record configured correctly, use the dig command, replacing EXAMPLE.COM with your apex domain. Confirm that the results match the IP addresses for GitHub Pages above.

For A records:

$ dig EXAMPLE.COM +noall +answer -t A
> EXAMPLE.COM    3600    IN A     185.199.108.153
> EXAMPLE.COM    3600    IN A     185.199.109.153
> EXAMPLE.COM    3600    IN A     185.199.110.153
> EXAMPLE.COM    3600    IN A     185.199.111.153

For AAAA records:

$ dig EXAMPLE.COM +noall +answer -t AAAA
> EXAMPLE.COM     3600    IN AAAA     2606:50c0:8000::153
> EXAMPLE.COM     3600    IN AAAA     2606:50c0:8001::153
> EXAMPLE.COM     3600    IN AAAA     2606:50c0:8002::153
> EXAMPLE.COM     3600    IN AAAA     2606:50c0:8003::153

8. If you use a static site generator to build your site locally and push the generated files to GitHub, pull the commit that added the CNAME file to your local repository. For more information, see "Troubleshooting custom domains and GitHub Pages."

9. Optionally, to enforce HTTPS encryption for your site, select Enforce HTTPS. It can take up to 24 hours before this option is available. For more information, see "Securing your GitHub Pages site with HTTPS."

## Configuring an apex domain and the www subdomain variant
If you are using an apex domain as your custom domain, we recommend also setting up a www subdomain. If you configure the correct records for each domain type through your DNS provider, GitHub Pages will automatically create redirects between the domains. For example, if you configure www.example.com as the custom domain for your site, and you have GitHub Pages DNS records set up for the apex and www domains, then example.com will redirect to www.example.com. Note that automatic redirects only apply to the www subdomain. Automatic redirects do not apply to any other subdomains.

## Configuring a subdomain
To set up a www or custom subdomain, such as www.example.com or blog.example.com, you must add your domain in the repository settings. After that, configure a CNAME record with your DNS provider

1. Add custom domain in github pages and save

2. Navigate to your DNS provider and create a CNAME record that points your subdomain to the default domain for your site. For example, if you want to use the subdomain www.example.com for your user site, create a CNAME record that points www.example.com to <user>.github.io. If you want to use the subdomain another.example.com for your organization site, create a CNAME record that points another.example.com to <organization>.github.io. The CNAME record should always point to <user>.github.io or <organization>.github.io, excluding the repository name. For more information about how to create the correct record, see your DNS provider's

3. Open Git Bash.

4. To confirm that your DNS record configured correctly, use the dig command, replacing WWW.EXAMPLE.COM with your subdomain.

$ dig WWW.EXAMPLE.COM +nostats +nocomments +nocmd
> ;WWW.EXAMPLE.COM.                    IN      A
> WWW.EXAMPLE.COM.             3592    IN      CNAME   YOUR-USERNAME.github.io.
> YOUR-USERNAME.github.io.      43192   IN      CNAME   GITHUB-PAGES-SERVER .
> GITHUB-PAGES-SERVER .         22      IN      A       192.0.2.1

5. If you use a static site generator to build your site locally and push the generated files to GitHub, pull the commit that added the CNAME file to your local repository. For more information, see "Troubleshooting custom domains and GitHub Pages."

6. Optionally, to enforce HTTPS encryption for your site, select Enforce HTTPS. It can take up to 24 hours before this option is available. For more information, see "Securing your GitHub Pages site

Note: If you point your custom subdomain to your apex domain, you will encounter issues with enforcing HTTPS to your website, and you may encounter issues where your subdomain does not reach your GitHub Pages site at all.


## DNS records for your custom domain
If you are familiar with the process of configuring your domain for a GitHub Pages site, you can use the table below to find the DNS values for your specific scenario and the DNS record types that your DNS provider supports.

To configure an apex domain, you only need to pick a single DNS record type from the table below. To configure an apex domain and www subdomain (for example, example.com and www.example.com), configure the apex domain and then the subdomain

Scenario	       DNS record type	  DNS record name	   DNS record value(s)
Apex domain
(example.com)	       A	              @	                185.199.108.153
                                                        185.199.109.153
                                                        185.199.110.153
                                                        185.199.111.153
Apex domain
(example.com)	      AAAA	            @	                2606:50c0:8000::153
                                                        2606:50c0:8001::153
                                                        2606:50c0:8002::153
                                                        2606:50c0:8003::153
Apex domain
(example.com)	      ALIAS or ANAME	  @	                USERNAME.github.io or
                                                        ORGANIZATION.github.io
Subdomain
(ww​w.example.com,
blog.example.com)	  CNAME	            SUBDOMAIN	        USERNAME.github.io or
                                                        ORGANIZATION.github.io


## Removing a custom domain
If you get an error about a custom domain being taken, you may need to remove the custom domain from another repository.

1. On GitHub, navigate to your site's repository.

2. Under your repository name, click  Settings. If you cannot see the "Settings" tab, select the  dropdown menu, then click Settings.

3. In the "Code and automation" section of the sidebar, click  Pages.

4. Under "Custom domain," click Remove.

## Securing your custom domain

If your GitHub Pages site is disabled but has a custom domain set up, it is at risk of a domain takeover. Having a custom domain configured with your DNS provider while your site is disabled could result in someone else hosting a site on one of your subdomains.

Verifying your custom domain prevents other GitHub users from using your domain with their repositories. If your domain is not verified, and your GitHub Pages site is disabled, you should immediately update or remove your DNS records with your DNS provider.

## DEPLOYING TO GH_PAGES
$ ng add angular-cli-ghpages
$ ng build --base-href https://[username].github.io/[repo]/` eg. ng build --base-href https://githives.com/ since I'm using custom domain(githives)

$ npx angular-cli-ghpages --dir=dist/[project-name]

If facing errros
$npm cache clean --force

OR
https://medium.com/tech-insights/how-to-deploy-angular-apps-to-github-pages-gh-pages-896c4e10f9b4

$ git branch gh-pages
$ git checkout gh-pages

$ git checkout -b gh-pages
$ git push origin gh-pages
$ npm install -g angular-cli-ghpages`
$ ng build --base-href https://[username].github.io/[repo]/`

### deploy
$ ngh --dir=dist/[project-name]`

OR -but not suggested
ng b --output-path docs --base-href /git-report-name  // This takes advantage of deploy from docs in github pages settings


Note: 
1. Make sure you put your “username”, “repo name” and the name of the project in place of “Project-name” in the commands above.

2. Make sure go to the repository pages settings and change branch to 'gh-pages'

You can find this in the angular.json file under defaultProject which is at the bottom of the file. If the project name is wrong, your App will not work; so if you are seeing any errors, check the angular.json to confirm if you used the correct project name.

** You only need to set the “--base-href” flag once, next time you make changes and build the project you can simply run:

$ ng build --prod

## SEO
1. Open index.html:
- Open the index.html file located in the src directory of your Angular project.

2. Add Meta Description:
Inside the <head> section of the HTML file, add the following meta tag for the description:
`<meta name="description" content="Githives - A hassle-free way to download specific files and folders from GitHub repositories. Say goodbye to cloning massive repos! Create shareable links for your files.">
`

3. Add Page Title:
Inside the <head> section of the HTML file, add the following <title> tag:
`<title>Githives - Hassle-free GitHub Repo Downloads</title>`

4. Schema Markup:
Implement structured data/schema markup to provide search engines with detailed information about your app's content, such as its features, supported platforms, reviews, and more.
Use tools like Google's Structured Data Markup Helper or Schema.org to generate schema markup code and add it to your Angular app's pages.

Add the generated schema markup to your Angular app's HTML pages. You can include it in the <head> section of each page or directly within relevant elements, such as product descriptions or reviews.