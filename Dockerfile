FROM node

# Setting up working dir.
WORKDIR /data/docker-teamster

# Add codebase to container.
ADD . /data/docker-teamster

CMD ["npm", "run", "start"]