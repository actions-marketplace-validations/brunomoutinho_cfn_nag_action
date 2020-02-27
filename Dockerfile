FROM ruby:2.5-alpine3.10

LABEL name="cfn_nag_action"
LABEL version="1.0.0"
LABEL repository="https://github.com/brunomoutinho/cfn_nag_action"
LABEL homepage="https://github.com/brunomoutinho/cfn_nag_action"

LABEL "com.github.actions.name"="cfn_nag_action"
LABEL "com.github.actions.description"="GitHub Action for cfn_nag"
LABEL "com.github.actions.icon"="box"
LABEL "com.github.actions.color"="black"

LABEL "maintainer"="Bruno Moutinho <brunoe.moutinho@gmail.com>"

# Install node
RUN apk add --update npm

# Install cfn_nag
RUN gem install cfn-nag --no-format-exec

# Copy matcher JSON file
COPY cfn_nag_matcher.json /cfn_nag_matcher.json

# Copy JS function to format output from cfn_nag_scan
COPY format_output.js /format_output.js

COPY entrypoint.sh /entrypoint.sh
RUN ["chmod", "+x", "/entrypoint.sh"]
ENTRYPOINT ["/entrypoint.sh"]
CMD ["**/*.yml"]

