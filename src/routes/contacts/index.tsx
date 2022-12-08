import {
  component$,
  Resource,
  useClientEffect$,
  useSignal,
} from '@builder.io/qwik';
import { RequestHandler, useEndpoint } from '@builder.io/qwik-city';

type Contact = {
  id: number;
  name: string;
};

export const onGet: RequestHandler<Contact[]> = () => {
  return [
    {
      id: 1,
      name: 'Jason',
    },
    {
      id: 2,
      name: 'Miško',
    },
  ];
};

export default component$(function Contacts() {
  const count = useSignal(0);
  const filter = useSignal('');

  console.log('counter');

  const endpoint = useEndpoint<typeof onGet>();

  return (
    <div>
      <button onClick$={() => count.value++}>Increment</button>
      <span>{count.value}</span>

      <form>
        <label for="search">Search</label>
        <input
          id="search"
          type="search"
          onInput$={(e) => {
            filter.value = (e.target as HTMLInputElement).value;
          }}
        />
      </form>

      <Resource
        value={endpoint}
        onPending={() => <p>loading contacts...</p>}
        onResolved={(contacts) => {
          return (
            <ul>
              {contacts
                .filter((contact) =>
                  contact.name.toLowerCase().includes(filter.value),
                )
                .map((contact) => {
                  return <li>{contact.name}</li>;
                })}
            </ul>
          );
        }}
      />

      <div style={{ height: '500px' }}>scroll down</div>

      <ClockWrapper />
    </div>
  );
});

export const ClockWrapper = component$(() => {
  return (
    <div>
      <h2>Look, a clock!</h2>
      <Clock />
    </div>
  );
});

export const Clock = component$(() => {
  const time = useSignal('');

  useClientEffect$(() => {
    const updateClock = () => {
      time.value = new Date().toString();
    };

    setInterval(updateClock, 1000);
    updateClock();
  });

  return <div>{time.value}</div>;
});
