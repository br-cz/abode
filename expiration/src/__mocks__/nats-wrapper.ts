//redirecting the nats wrapper import with this fake one used for jest
export const natsWrapper = {
  client: {
    //emulate publish function from the original natsWrapper
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
