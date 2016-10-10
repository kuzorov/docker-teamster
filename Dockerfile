FROM node

# Install app.
WORKDIR ./data/docker-teamster

# Install app.
ADD ./ /data/docker-teamster

# Expose search port.
EXPOSE 80

CMD ["npm", "run", "start"]
