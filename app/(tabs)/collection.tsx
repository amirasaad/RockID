import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Card, Screen, SectionTitle } from '@/components/Layout';
import { Chip } from '@/components/Chip';
import { palette } from '@/constants/theme';
import { recentFinds } from '@/lib/mock-data';

export default function CollectionScreen() {
  return (
    <Screen title="Collection" subtitle="Saved samples, quick filters, and room to grow into sync later.">
      <SectionTitle>Filters</SectionTitle>
      <Card>
        <Text style={styles.search}>Search saved finds</Text>
        <Card>
          <Chip label="All" selected />
          <Chip label="Igneous" />
          <Chip label="Sedimentary" />
          <Chip label="Metamorphic" />
        </Card>
      </Card>
      {recentFinds.map((find) => (
        <Link href={`/saved/${find.id}`} key={find.id} asChild>
          <Card>
            <Text style={styles.title}>{find.title}</Text>
            <Text style={styles.meta}>{find.date}</Text>
            <Text style={styles.meta}>{find.confidence} confidence</Text>
          </Card>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    color: palette.muted,
    fontSize: 15,
  },
  title: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: palette.muted,
    fontSize: 14,
  },
});
