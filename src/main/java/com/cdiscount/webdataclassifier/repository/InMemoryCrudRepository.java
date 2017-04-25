package com.cdiscount.webdataclassifier.repository;

import com.google.common.collect.Maps;
import org.springframework.data.repository.CrudRepository;

import java.io.Serializable;
import java.util.Map;

/**
 * Created by cedricverhooste on 25/04/17.
 */
@SuppressWarnings("unchecked")
public abstract class InMemoryCrudRepository<T, ID extends Serializable> implements CrudRepository<T, ID> {

    private static Map mapImages = Maps.newLinkedHashMap();

    @Override
    public <S extends T> S save(S entity) {
        return (S) mapImages.put(getId(entity), entity);
    }

    @Override
    public <S extends T> Iterable<S> save(Iterable<S> entities) {
        entities.forEach(entity ->  mapImages.put(getId(entity), entity));
        return entities;
    }

    @Override
    public T findOne(ID aK) {
        return (T) mapImages.get(aK);
    }

    @Override
    public boolean exists(ID aK) {return mapImages.containsKey(aK);}

    @Override
    public Iterable<T> findAll() {
        return mapImages.values();
    }

    @Override
    public Iterable<T> findAll(Iterable<ID> longs) {
        return findAll();
    }

    @Override
    public long count() {
        return mapImages.size();
    }

    @Override
    public void delete(ID aK) { mapImages.remove(aK);    }

    @Override
    public void delete(T entity) { delete(getId(entity)); }

    @Override
    public void delete(Iterable<? extends T> entities) { entities.forEach(this::delete); }

    @Override
    public void deleteAll() { mapImages.clear(); }

    public abstract ID getId(T entity);
}
