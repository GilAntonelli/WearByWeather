import { Href, Link, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Linking, Platform } from 'react-native';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

const isExternal = (url: string) => /^https?:\/\//i.test(url);

export function ExternalLink({ href, ...rest }: Props) {
  const onPress: ComponentProps<typeof Link>['onPress'] = async (event) => {
    if (Platform.OS === 'web') return;

    event.preventDefault();

    try {
      if (isExternal(href)) {
        await WebBrowser.openBrowserAsync(href, {
          // you can theme these later:
          toolbarColor: '#111',
          controlsColor: '#fff',
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        });
      } else {
        // treat as internal route
        router.push(href as any);
      }
    } catch {
      // graceful fallback
      if (isExternal(href)) Linking.openURL(href);
      else router.push(href as any);
    }
  };

  return (
    <Link
      {...rest}
      href={href}
      target="_blank"
      accessibilityRole="link"
      onPress={onPress}
    />
  );
}
